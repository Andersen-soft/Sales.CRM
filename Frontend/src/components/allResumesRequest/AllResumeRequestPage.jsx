// @flow

import React, {
    useEffect,
    useRef,
    useState,
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
import { getDate } from 'crm-utils/dates';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import type { StyledComponentProps } from '@material-ui/core/es';
import { ALL_RESUME_REQUESTS, PAGE_SIZE } from 'crm-constants/allResumeRequests/resumeRequestsConstants';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { HEAD_SALES } from 'crm-roles';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getResumeRequests, downloadReport } from 'crm-api/allResumeRequestsService/allResumeRequestsService';
import Download from '@material-ui/icons/GetApp';
import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import type { ResumeRequest } from 'crm-types/allResumeRequests';
import { pathOr } from 'ramda';
import getConfig from './getConfig';

import styles from './AllResumeRequestPageStyles';

type Props = {
    roles: Array<string>,
} & StyledComponentProps;

const AllResumeRequestPage = ({
    roles,
    classes,
}: Props) => {
    const initialLocalStorageValues = useMemo(() => {
        const localStorageFilters = localStorage.getItem(ALL_RESUME_REQUESTS);

        return localStorageFilters ? JSON.parse(localStorageFilters) : {};
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [isDownload, setIsDownload] = useState(false);
    const [resumeRequestList, setResumeRequestList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(pathOr('', ['sort'], initialLocalStorageValues));
    const [filters, setFilters] = useState(pathOr({}, ['filters'], initialLocalStorageValues));

    const translations = {
        requestsForCv: useTranslation('allRequestForCv.requestsForCv'),
        downloadCSV: useTranslation('allRequestForCv.downloadCSV'),
    };

    const tableRef = useRef(null);

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

    const fetchResumeRequests = async () => {
        setIsLoading(true);

        const result = await getResumeRequests({
            ...filters,
            sort,
            page,
        });

        setResumeRequestList(result.content);
        setTotalElements(result.totalElements);
        setIsLoading(false);
    };

    useEffect(() => {
        document.title = 'CV requests';
    }, []);

    useEffect(() => {
        fetchResumeRequests();
        scrollTop();
    }, [filters, sort, page]);

    const handleSetFilters = (
        filterName: string,
        filterValue: number | string | Array<string> | Array<number>
    ) => {
        localStorage.setItem(ALL_RESUME_REQUESTS, JSON.stringify({
            sort,
            filters: { ...filters, [filterName]: filterValue },
        }));
        setFilters({ ...filters, [filterName]: filterValue });
    };

    const handlePageChange = (newPage: number) => setPage(newPage);

    const handleDownloadReport = async () => {
        setIsDownload(true);
        const fileReport = await downloadReport({ ...filters }, sort);

        saveAs(new Blob([fileReport]), 'resume_requests.csv');
        setIsDownload(false);
    };

    const setSortWithLocalStorage = sortType => {
        localStorage.setItem(ALL_RESUME_REQUESTS, JSON.stringify({
            filters,
            sort: sortType,
        }));
        setSort(sortType);
    };

    const getTranslatedConfig = () => {
        const config = getConfig(
            filters,
            sort,
            handleSetFilters,
            setSortWithLocalStorage,
        );

        return config.map(cellConfig => ({ ...cellConfig, title: useTranslation(cellConfig.title) }));
    };

    const prepareData = () => resumeRequestList.map(
        ({
            resumeRequestId: id,
            name,
            companyName,
            status,
            deadline,
            responsible,
            createDate,
            responsibleForSaleRequestName,
            countResume,
            returnsResumeCount,
            companySaleId,
            responsibleId,
            responsibleForSaleRequestId,
        }: ResumeRequest) => ({
            id,
            companyName: { name: companyName, id: companySaleId, baseURL: '/sales' },
            status,
            name: { id, name, baseURL: '/resume-requests' },
            deadline: getDate(deadline, FULL_DATE_CS),
            responsible: { name: responsible, id: responsibleId, reloadParent: fetchResumeRequests },
            createDate: getDate(createDate, FULL_DATE_CS),
            responsibleForSaleRequestName: {
                name: responsibleForSaleRequestName,
                id: responsibleForSaleRequestId,
                reloadParent: fetchResumeRequests,
            },
            countResume,
            returnsResumeCount,
        })
    );

    return (
        <RootRef rootRef={tableRef}>
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
                    <Typography>{translations.requestsForCv}</Typography>
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
                <Grid className={classes.wrapTable} >
                    <CRMTable
                        columnsConfig={getTranslatedConfig()}
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
        </RootRef>
    );
};

export default withStyles(styles)(AllResumeRequestPage);
