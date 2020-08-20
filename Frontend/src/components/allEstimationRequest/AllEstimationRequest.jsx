// @flow

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import {
    Paper,
    RootRef,
    Grid,
    Typography,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import cn from 'classnames';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import type { StyledComponentProps } from '@material-ui/core/es';
import {
    PAGE_SIZE,
    COLUMN_KEYS,
    ALL_ESTIMATION_REQUESTS,
} from 'crm-constants/allEstimationRequests/estimationRequestsConstants';
import {
    downloadReport,
    getEstimationRequests,
    getEstimationStatuses,
} from 'crm-api/allEstimationRequestsService/allEstimationRequestsService';
import { useTranslation } from 'crm-hooks/useTranslation';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { HEAD_SALES } from 'crm-roles';
import Download from '@material-ui/icons/GetApp';
import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import {
    InputFilter,
    AutocompleteFilter,
    CheckboxFilter,
} from 'crm-components/common/CRMFiltrationComponent';
import { getDataForFilter } from 'crm-utils/dataTransformers/suggestionTransform/suggestionTransform';
import { pathOr } from 'ramda';
import { LinkCell, UserCell } from 'crm-components/common/TableCells';

import styles from './AllEstimationRequestStyles';

type Props = {
    roles: Array<string>,
} & StyledComponentProps;

const AllEstimationRequest = ({
    classes,
    roles,
}: Props) => {
    const initialLocalStorageValues = useMemo(() => {
        const localStorageFilters = localStorage.getItem(ALL_ESTIMATION_REQUESTS);

        return localStorageFilters ? JSON.parse(localStorageFilters) : {};
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [isDownload, setIsDownload] = useState(false);
    const [estimationRequestList, setEstimationRequestList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(pathOr('', ['sort'], initialLocalStorageValues));
    const [filters, setFilters] = useState(pathOr({}, ['filters'], initialLocalStorageValues));

    const translations = {
        requestForEstimation: useTranslation('allRequestForEstimation.requestForEstimation'),
        downloadCSV: useTranslation('allRequestForEstimation.downloadCSV'),
        requestName: useTranslation('allRequestForEstimation.tableColumnTitle.requestName'),
        company: useTranslation('allRequestForEstimation.tableColumnTitle.company'),
        status: useTranslation('allRequestForEstimation.tableColumnTitle.status'),
        deadline: useTranslation('allRequestForEstimation.tableColumnTitle.deadline'),
        responsibleForRequest: useTranslation('allRequestForEstimation.tableColumnTitle.responsibleForRequest'),
        created: useTranslation('allRequestForEstimation.tableColumnTitle.created'),
        responsibleForSaleRequest: useTranslation('allRequestForEstimation.tableColumnTitle.responsibleForSaleRequest'),
    };

    const tableRef = useRef();

    const scrollTop = () => {
        const { current } = tableRef;

        if (current) {
            current.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        }
    };

    const fetchEstimationsRequests = async () => {
        setIsLoading(true);

        const { content, totalElements: responseTotalElements } = await getEstimationRequests({
            ...filters,
            sort,
            page,
        });

        setEstimationRequestList(content);
        setTotalElements(responseTotalElements);
        setIsLoading(false);
    };

    useEffect(() => {
        document.title = 'Requests for estimation';
    }, []);

    useEffect(() => {
        fetchEstimationsRequests();
        scrollTop();
    }, [filters, sort, page]);

    const handleSetFilters = (
        filterName: string,
        filterValue: number | string | Array<string> | Array<number>
    ) => {
        localStorage.setItem(ALL_ESTIMATION_REQUESTS, JSON.stringify({
            sort,
            filters: { ...filters, [filterName]: filterValue },
        }));
        setFilters({ ...filters, [filterName]: filterValue });
    };

    const handlePageChange = (newPage: number) => setPage(newPage);

    const handleDownloadReport = async () => {
        setIsDownload(true);
        const fileReport = await downloadReport({ ...filters }, sort);

        saveAs(new Blob([fileReport]), 'estimation_requests.csv');
        setIsDownload(false);
    };

    const setSortWithLocalStorage = sortType => {
        localStorage.setItem(ALL_ESTIMATION_REQUESTS, JSON.stringify({
            filters,
            sort: sortType,
        }));
        setSort(sortType);
    };

    const getConfig = () => [
        {
            title: translations.requestName,
            key: 'name',
            RenderCell: LinkCell,
            filterParams: {
                component: InputFilter,
                onSetFilters: handleSetFilters,
                filters,
            },
        },
        {
            title: translations.company,
            key: 'companyName',
            RenderCell: LinkCell,
            filterParams: {
                component: AutocompleteFilter,
                filterName: COLUMN_KEYS.COMPANY,
                onSetFilters: handleSetFilters,
                getFilterParams: getDataForFilter('company'),
                filters,
            },
        },
        {
            title: translations.status,
            key: 'status',
            filterParams: {
                component: CheckboxFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getEstimationStatuses,
                filters,
            },
        },
        {
            title: translations.deadline,
            key: 'deadline',
            sortingParams: {
                changeSorting: setSortWithLocalStorage,
                sort,
            },
        },
        {
            title: translations.responsibleForRequest,
            key: 'responsibleForRequest',
            RenderCell: UserCell,
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getDataForFilter('responsibleForRequest'),
                filters,
            },
        },
        {
            title: translations.created,
            key: 'createDate',
            sortingParams: {
                changeSorting: setSortWithLocalStorage,
                sort,
            },
        },
        {
            title: translations.responsibleForSaleRequest,
            key: 'responsibleForSaleRequest',
            RenderCell: UserCell,
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getDataForFilter('responsibleForSaleRequest'),
                filters,
            },
        },
    ];

    const prepareData = () => estimationRequestList.map(
        ({
            id,
            name,
            companyName,
            status,
            deadline,
            responsibleForRequest,
            createDate,
            responsibleForSaleRequest,
            saleId,
        }) => ({
            id,
            name: { id, name, baseURL: '/estimation-requests' },
            companyName: { name: companyName, id: saleId, baseURL: '/sales' },
            status,
            deadline: getDate(deadline, FULL_DATE_CS),
            responsibleForRequest: {
                name: responsibleForRequest && `${responsibleForRequest.firstName} ${responsibleForRequest.lastName}`,
                id: responsibleForRequest && responsibleForRequest.id,
                reloadParent: fetchEstimationsRequests,
            },
            createDate: getDate(createDate, FULL_DATE_CS),
            responsibleForSaleRequest: {
                name: responsibleForSaleRequest && `${responsibleForSaleRequest.firstName} ${responsibleForSaleRequest.lastName}`,
                id: responsibleForSaleRequest && responsibleForSaleRequest.id,
                reloadparent: fetchEstimationsRequests,
            },
        })
    );

    return (<RootRef rootRef={tableRef}>
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: cn(classes.rounded, { [classes.wrapPadding]: roles.includes(HEAD_SALES) }) }}
        >
            {roles.includes(HEAD_SALES) && <Grid
                container
                justify='space-between'
                className={classes.topBarContainer}
            >
                <Typography>{translations.requestForEstimation}</Typography>
                <Tooltip
                    title={translations.downloadCSV}
                    interactive
                    placement='bottom-start'
                >
                    <IconButton
                        className={classes.iconButton}
                        onClick={handleDownloadReport}
                    >
                        <CRMIcon IconComponent={Download} />
                    </IconButton>
                </Tooltip>
            </Grid>}
            <Grid className={classes.wrapTable}>
                <CRMTable
                    columnsConfig={getConfig()}
                    data={prepareData()}
                    isLoading={isLoading}
                    classes={{
                        root: classes.tableRoot,
                        cell: classes.cell,
                        head: classes.head,
                        headerCell: classes.headerCell,
                        title: classes.title,
                    }}
                    paginationParams={{
                        rowsPerPage: PAGE_SIZE,
                        page,
                        count: totalElements,
                        onChangePage: handlePageChange,
                    }}
                    loaderPosition='fixed'
                />
            </Grid>
            {isDownload && <CRMLoader />}
        </Paper>
    </RootRef>);
};

export default withStyles(styles)(AllEstimationRequest);
