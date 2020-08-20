// @flow

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { isNil, pathOr, equals, tail } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import {
    Grid,
    Paper,
    RootRef,
    Tooltip,
    Typography,
    IconButton,
    Button,
} from '@material-ui/core';
import Download from '@material-ui/icons/GetApp';
import {
    isWithinInterval,
    subDays,
    isAfter,
    startOfDay,
    endOfDay,
} from 'date-fns';
import { saveAs } from 'file-saver';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMIcon from 'crm-ui/CRMIcons/CRMIcon';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import {
    CREATE_NEW_RESUME_TOPIC,
    DELETE_RESUME_TOPIC,
    PAGE_SIZE,
    UPDATE_RESUME_TOPIC,
    UPDATE_RSUME_REQUEST_NAME_OR_DEADLINE_TOPIC,
    RESUME_FILTERS,
    ACTUAL_FILTER,
    URGENT_FILTER,
} from 'crm-constants/ResumePage/resumePageConstants';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import {
    fetchAllResumes,
    downloadResumeReport,
    getResumeStatuses,
    getResponsibleHr,
} from 'crm-api/ResumeService/resumeService';
import { getDate } from 'crm-utils/dates';
import {
    FULL_DATE_CS,
    CRM_FULL_DATE_SERVER_FORMAT,
    FULL_DATE_DS,
} from 'crm-constants/dateFormat';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import crmSocket, { SUBSCRIPTIONS_PAGE_KEYS as KEYS } from 'crm-helpers/api/crmSocket';
import {
    InputFilter,
    AutocompliteMultiFilter,
    CheckboxStatusFilter,
} from 'crm-components/common/CRMFiltrationComponent';
import FireSVG from 'crm-static/customIcons/Fire.svg';
import FireActiveSVG from 'crm-static/customIcons/Fire_active.svg';
import Notification from 'crm-components/notification/NotificationSingleton';

import RequestName from './Cells/RequestName';
import UserCell from './Cells/UserCell';
import FioCell from './Cells/FioCell';
import StatusCell from './Cells/StatusCell';
import CommentCell from './Cells/CommentCell/CommentCell';

import style from './ResumeStyles';

type FiltrationParamsType = {
    current: {
        actual: ?Array<string>,
        isUrgent: ?boolean,
        status: ?Array<string>,
        dateRange: {
            from: Date,
            to: Date,
        },
        sort: string,
        fio?: ?string,
        responsibleHr?: ?Array<number>,
        resumeRequest?: ?string,
    },
}

type Props = {
    classes: Object,
}

const getActualFilterKey = (statuses: Array<string>) => {
    switch (true) {
        case equals(statuses, ACTUAL_FILTER.actual.value):
            return ACTUAL_FILTER.actual.key;
        case equals(statuses, ACTUAL_FILTER.notActual.value):
            return ACTUAL_FILTER.notActual.key;
        case equals(statuses, ACTUAL_FILTER.all.value):
            return ACTUAL_FILTER.all.key;
        default: return ACTUAL_FILTER.default.key;
    }
};

const ResumePage = ({
    classes,
}: Props) => {
    const filterParams = useMemo(() => {
        const params = localStorage.getItem(RESUME_FILTERS);

        if (params) {
            return JSON.parse(params, (key, value) => key === 'dateRange'
                ? { from: new Date(value.from), to: new Date(value.to) }
                : value);
        }

        return {};
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [isDownload, setIsDownload] = useState(false);
    const [resumeList, setResumeList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [dateRange, setDateRange] = useState(pathOr({
        from: startOfDay(subDays(new Date(), 6)),
        to: endOfDay(new Date()),
    }, ['dateRange'], filterParams));
    const [page, setPage] = useState(0);
    const [statuses, setStatuses] = useState([]);
    const [responsibleHrsList, setResponsibleHrsList] = useState([]);
    const [sort, setSort] = useState('deadline,desc');
    const [filters, setFilters] = useState({
        actual: ACTUAL_FILTER.actual.value,
        isUrgent: null,
        status: null,
    });
    const [actualFilterKey, setActualFilterKey] = useState(getActualFilterKey(
        pathOr(ACTUAL_FILTER.actual.value, ['filters', 'actual'], filterParams)
    ));

    const tableRef = useRef(null);

    const filtrationParams: FiltrationParamsType = useRef({
        actual: ACTUAL_FILTER.actual.value,
        isUrgent: null,
        status: null,
        sort: 'deadline,desc',
        dateRange: pathOr({
            from: subDays(new Date(), 6),
            to: new Date(),
        }, ['dateRange'], filterParams),
    });
    const resumeListParams = useRef(resumeList);
    const resumeListLoading = useRef(false);
    const pageParams = useRef(0);

    const translations = {
        resume: useTranslation('resume.resume'),
        downloadCSV: useTranslation('allRequestForCv.downloadCSV'),
        deadline: useTranslation('allRequestForCv.tableColumnTitle.deadline'),
        status: useTranslation('allRequestForCv.tableColumnTitle.status'),
        responsible: useTranslation('requestForCv.cvSection.responsibleHR'),
        request: useTranslation('resume.request'),
        fullName: useTranslation('resume.fullName'),
        comment: useTranslation('resume.comment'),
        createNewApplicant: useTranslation('resume.createNewApplicant'),
        applicantDetails: useTranslation('resume.applicantDetails'),
        changedInRequest: useTranslation('resume.changedInRequest'),
        periodOfCreationApplicant: useTranslation('resume.periodOfCreationApplicant'),
        byActual: useTranslation('resume.byActual'),
        actual: useTranslation('resume.actual'),
        notActual: useTranslation('resume.notActual'),
        allApplicant: useTranslation('resume.allApplicant'),
        byUrgent: useTranslation('resume.byUrgent'),
        urgent: useTranslation('resume.urgent'),
        notUrgent: useTranslation('resume.notUrgent'),
        changeDeadline: useTranslation('resume.changeDeadline'),
    };

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

    const fetchResume = async (
        dateRangeProps = dateRange,
        sortProps = sort,
        pageProps = page,
        filtersParams = filters,
    ) => {
        setIsLoading(true);
        scrollTop();
        const { content, totalElements: totalElementsProps } = await fetchAllResumes({
            createDate: [
                getDate(startOfDay(dateRangeProps.from), CRM_FULL_DATE_SERVER_FORMAT),
                getDate(endOfDay(dateRangeProps.to), CRM_FULL_DATE_SERVER_FORMAT),
            ],
            page: pageProps,
            ...filtersParams,
            sort: sortProps,
            status: filtersParams.status || filtersParams.actual,
        });

        setResumeList(content);
        resumeListParams.current = content;
        setTotalElements(totalElementsProps);
        setIsLoading(false);
        resumeListLoading.current = false;
    };

    const handleSetFilters = (filterName: string, filterValue: any) => {
        setFilters({ ...filters, [filterName]: filterValue });
        fetchResume(dateRange, sort, page, { ...filters, [filterName]: filterValue });

        filtrationParams.current = {
            ...filtrationParams.current,
            [filterName]: filterValue,
        };
    };

    const changeActualFilter = (key: string) => {
        setActualFilterKey(key);

        const selectedStatuses: Array<string> = ACTUAL_FILTER[key].value;

        if (selectedStatuses) {
            setFilters({
                ...filters,
                actual: selectedStatuses,
                status: null,
            });
            fetchResume(dateRange, sort, page, {
                ...filters,
                actual: selectedStatuses,
                status: null,
            });
            filtrationParams.current = {
                ...filtrationParams.current,
                actual: selectedStatuses,
                status: null,
            };
        }
    };

    const checkResumeGetsIntoFiltering = ({
        requestId,
        requestName,
        dateCreated,
        status,
        isUrgent,
        fio,
        responsibleEmployee,
    }) => {
        const currentFilters = filtrationParams.current;
        const currentList = resumeListParams.current;
        const requestFullName = `${requestId}-${requestName}`;
        const currentStatusFilter = currentFilters.status || currentFilters.actual;

        const checkFilters = {
            inInterval: isNil(dateCreated) || (!!currentList.length && isWithinInterval(new Date(dateCreated), {
                start: startOfDay(currentFilters.dateRange.from),
                end: endOfDay(currentFilters.dateRange.to),
            })),
            inStatusFilter: !currentStatusFilter || currentStatusFilter.includes(status),
            inUrgentFilter: isNil(currentFilters.isUrgent) || currentFilters.isUrgent === isUrgent,
            inFioFilter: !currentFilters.fio || fio.includes(currentFilters.fio),
            inResponsibleHrFilter: !currentFilters.responsibleHr
                || currentFilters.responsibleHr.includes(responsibleEmployee.id),
            inResumeRequestNameFilter: !currentFilters.resumeRequest
                || requestFullName.includes(currentFilters.resumeRequest),
        };

        return Object.values(checkFilters).every(value => value);
    };

    const checkIsDeadlineMoreAfterWeek = deadline => isAfter(subDays(Date.now(), 7), new Date(deadline));

    const onCreateResume = socketMessage => {
        if (!resumeListLoading.current) {
            const newResume = JSON.parse(socketMessage.body);
            const { dateRange: dateRangeCurrent, sort: sortCurrent, ...filtersCurrent } = filtrationParams.current;
            const pageCurrent = pageParams.current;

            checkResumeGetsIntoFiltering(newResume)
                && fetchResume(dateRangeCurrent, sortCurrent, pageCurrent, filtersCurrent);

            checkIsDeadlineMoreAfterWeek(newResume.deadline)
            && Notification.showMessage({
                message: `${translations.createNewApplicant} ${newResume.requestId} - ${newResume.requestName}.`,
                type: 'warning',
                closeTimeout: 15000,
            });
        }
    };

    const onUpdateResume = socketMessage => {
        if (!resumeListLoading.current) {
            const updatedResume = JSON.parse(socketMessage.body);
            const { dateRange: dateRangeCurrent, sort: sortCurrent, ...filtersCurrent } = filtrationParams.current;
            const pageCurrent = pageParams.current;

            if (resumeListParams.current.find(({ id }) => id === updatedResume.id)) {
                fetchResume(dateRangeCurrent, sortCurrent, pageCurrent, filtersCurrent);
            } else {
                checkResumeGetsIntoFiltering(updatedResume)
                    && fetchResume(dateRangeCurrent, sortCurrent, pageCurrent, filtersCurrent);
            }

            checkIsDeadlineMoreAfterWeek(updatedResume.deadline)
            && Notification.showMessage({
                message: `${translations.applicantDetails} ${updatedResume.fio} ${translations.changedInRequest}
                     ${updatedResume.requestId} - ${updatedResume.requestName}.`,
                type: 'warning',
                closeTimeout: 15000,
            });
        }
    };

    const onDeleteResume = socketMessage => {
        if (!resumeListLoading.current) {
            const { requestId } = JSON.parse(socketMessage.body);
            const { dateRange: dateRangeCurrent, sort: sortCurrent, ...filtersCurrent } = filtrationParams.current;
            const pageCurrent = pageParams.current;

            resumeListParams.current.find(({ id }) => id === requestId)
                && fetchResume(dateRangeCurrent, sortCurrent, pageCurrent, filtersCurrent);
        }
    };

    const onUpdateResumeRequestNameOrDeadline = socketMessage => {
        const { id, oldName, name, oldDeadline, deadline } = JSON.parse(socketMessage.body);
        const { dateRange: dateRangeCurrent, sort: sortCurrent, ...filtersCurrent } = filtrationParams.current;
        const pageCurrent = pageParams.current;
        const currentList = resumeListParams.current;

        (name || deadline)
            && currentList.find(({ resumeRequest: { id: requestId } }) => requestId === id)
            && fetchResume(dateRangeCurrent, sortCurrent, pageCurrent, filtersCurrent);

        if (deadline) {
            checkIsDeadlineMoreAfterWeek(oldDeadline)
                && Notification.showMessage({
                    message: `${translations.changeDeadline} ${id} - ${oldName}.`,
                    type: 'warning',
                    closeTimeout: 15000,
                });
        }
    };

    useEffect(() => {
        document.title = translations.resume;
        fetchResume();

        getResumeStatuses().then(statusesList => setStatuses(tail(statusesList)));
        getResponsibleHr().then(({ content }) => setResponsibleHrsList(content));

        crmSocket.subscribe(CREATE_NEW_RESUME_TOPIC, onCreateResume, KEYS.Resume);
        crmSocket.subscribe(UPDATE_RESUME_TOPIC, onUpdateResume, KEYS.Resume);
        crmSocket.subscribe(DELETE_RESUME_TOPIC, onDeleteResume, KEYS.Resume);
        crmSocket.subscribe(UPDATE_RSUME_REQUEST_NAME_OR_DEADLINE_TOPIC, onUpdateResumeRequestNameOrDeadline, KEYS.Resume);

        crmSocket.activate();

        return () => {
            crmSocket.deactivate(KEYS.Resume);
        };
    }, []);

    const handleDownloadReport = async () => {
        setIsDownload(true);
        const { from, to } = dateRange;

        const report = await downloadResumeReport({
            createDate: [
                getDate(startOfDay(from), CRM_FULL_DATE_SERVER_FORMAT),
                getDate(endOfDay(to), CRM_FULL_DATE_SERVER_FORMAT),
            ],
            ...filters,
        });
        const csvReportName = `${getDate(from, FULL_DATE_DS)} - ${getDate(to, FULL_DATE_DS)}.csv`;

        saveAs(new Blob([report]), csvReportName);

        setIsDownload(false);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        pageParams.current = newPage;
        fetchResume(dateRange, sort, newPage);
    };

    const changeSorting = (newSort: string) => {
        setSort(newSort);
        filtrationParams.current = {
            ...filtrationParams.current,
            sort: newSort,
        };
        fetchResume(dateRange, newSort);
    };

    const handleSelectRange = (from, to) => {
        if (from && to) {
            const start = startOfDay(from);
            const end = endOfDay(to);

            setDateRange({ from: start, to: end });
            fetchResume({ from: start, to: end });

            filtrationParams.current = {
                ...filtrationParams.current,
                dateRange: { from: start, to: end },
            };
            localStorage.setItem(
                RESUME_FILTERS,
                JSON.stringify({ dateRange: { from: start, to: end } })
            );
        }
    };

    const getStatuses = () => ACTUAL_FILTER[actualFilterKey].value;

    const getResponsibleHrSuggestionList = () => responsibleHrsList.map(({
        firstName,
        lastName,
        id,
    }) => ({ label: `${firstName} ${lastName}`, value: id }));

    const getSelectedRows = () => {
        if (resumeList.length) {
            let highlighted = false;

            return resumeList.reduce((result, currentItem, index) => {
                const previousId = pathOr(null, ['resumeRequest', 'id'], resumeList[index - 1]);
                const currentId = pathOr(null, ['resumeRequest', 'id'], currentItem);

                if (previousId && (currentId !== previousId)) {
                    highlighted = !highlighted;
                }

                return highlighted ? [...result, currentItem.id] : [...result];
            }, []);
        }

        return null;
    };

    const setResumeListLoading = () => {
        setIsLoading(true);
        resumeListLoading.current = true;
    };

    const tableConfig = [
        {
            title: translations.deadline,
            key: 'deadline',
            sortingParams: {
                changeSorting,
                sort,
            },
        },
        {
            title: translations.request,
            key: 'resumeRequest',
            RenderCell: RequestName,
            filterParams: {
                component: InputFilter,
                onSetFilters: handleSetFilters,
                filters,
            },
        },
        {
            title: translations.fullName,
            key: 'fio',
            RenderCell: FioCell,
            filterParams: {
                component: InputFilter,
                onSetFilters: handleSetFilters,
                filters,
            },
        },
        {
            title: translations.status,
            key: 'status',
            RenderCell: StatusCell,
            filterParams: {
                component: CheckboxStatusFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getStatuses,
                filters,
            },
        },
        {
            title: translations.responsible,
            key: 'responsible',
            RenderCell: UserCell,
            filterParams: {
                component: AutocompliteMultiFilter,
                filterName: 'responsibleHr',
                onSetFilters: handleSetFilters,
                getFilterParams: getResponsibleHrSuggestionList,
                filters,
            },
        },
        {
            title: translations.comment,
            key: 'comment',
            RenderCell: CommentCell,
        },
    ];

    const prepareData = rawList => rawList.map(({
        deadline,
        id,
        resumeRequest: { id: resumeRequestId, name },
        fio,
        status,
        responsibleHr,
        comment,
        isUrgent,
    }) => ({
        id,
        deadline: getDate(deadline, FULL_DATE_CS),
        resumeRequest: [resumeRequestId, name],
        fio: [fio, id, isUrgent, fetchResume, setResumeListLoading],
        status: [status, statuses, id, fetchResume, setResumeListLoading],
        responsible: [responsibleHr, responsibleHrsList, id, fetchResume, setResumeListLoading],
        comment: [comment, id, fetchResume, setResumeListLoading],
    }));

    return <RootRef rootRef={tableRef}>
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid
                className={classes.wrapper}
            >
                <Grid
                    container
                    justify='space-between'
                    className={classes.topBarContainer}
                    wrap='nowrap'
                >
                    <Grid
                        container
                        item
                    >
                        <Grid
                            item
                            className={cn(classes.filterWrapper, classes.dateRange)}
                        >
                            <Typography className={classes.filterTitle}>
                                {translations.periodOfCreationApplicant}
                            </Typography>
                            <CRMDateRangeInput
                                onSelectRange={handleSelectRange}
                                startDate={dateRange.from}
                                endDate={dateRange.to}
                                clearable={false}
                            />
                        </Grid>
                        <Grid
                            item
                            className={classes.filterWrapper}
                        >
                            <Typography className={classes.filterTitle}>{translations.byActual}</Typography>
                            <Grid
                                className={classes.buttonWrapper}
                                container
                                alignItems='center'
                            >
                                <Button
                                    className={cn(
                                        classes.button,
                                        { [classes.activeButton]: actualFilterKey === ACTUAL_FILTER.actual.key }
                                    )}
                                    onClick={() => changeActualFilter(ACTUAL_FILTER.actual.key)}
                                >
                                    {translations.actual}
                                </Button>
                                <Button
                                    className={cn(
                                        classes.button,
                                        classes.middleButton,
                                        { [classes.activeButton]: actualFilterKey === ACTUAL_FILTER.notActual.key }
                                    )}
                                    onClick={() => changeActualFilter(ACTUAL_FILTER.notActual.key)}
                                >
                                    {translations.notActual}
                                </Button>
                                <Button
                                    className={cn(
                                        classes.button,
                                        { [classes.activeButton]: actualFilterKey === ACTUAL_FILTER.all.key }
                                    )}
                                    onClick={() => changeActualFilter(ACTUAL_FILTER.all.key)}
                                >
                                    {translations.allApplicant}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            className={classes.filterWrapper}
                        >
                            <Typography className={classes.filterTitle}>{translations.byUrgent}</Typography>
                            <Grid
                                className={classes.buttonWrapper}
                                container
                                alignItems='center'
                            >
                                <Button
                                    className={cn(
                                        classes.button,
                                        { [classes.activeButton]: filters.isUrgent === true }
                                    )}
                                    onClick={() => handleSetFilters('isUrgent', URGENT_FILTER.urgent)}
                                >
                                    <CRMIcon
                                        IconComponent={FireActiveSVG}
                                        className={classes.fireIcon}
                                    />
                                    {translations.urgent}
                                </Button>
                                <Button
                                    className={cn(
                                        classes.button,
                                        classes.middleButton,
                                        { [classes.activeButton]: filters.isUrgent === false }
                                    )}
                                    onClick={() => handleSetFilters('isUrgent', URGENT_FILTER.notUrgent)}
                                >
                                    <CRMIcon
                                        IconComponent={FireSVG}
                                        className={classes.fireIcon}
                                    />
                                    {translations.notUrgent}
                                </Button>
                                <Button
                                    className={cn(classes.button, { [classes.activeButton]: isNil(filters.isUrgent) })}
                                    onClick={() => handleSetFilters('isUrgent', URGENT_FILTER.all)}
                                >
                                    {translations.allApplicant}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        className={classes.downloadButton}
                    >
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
                    </Grid>
                </Grid>
                <Grid className={classes.wrapTable}>
                    <CRMTable
                        columnsConfig={tableConfig}
                        data={prepareData(resumeList)}
                        isLoading={isLoading}
                        classes={{
                            cell: classes.cell,
                            head: classes.head,
                            headerCell: classes.headerCell,
                            title: classes.title,
                        }}
                        paginationParams={{
                            rowsPerPage: PAGE_SIZE,
                            page,
                            count: totalElements,
                            onChangePage: handleChangePage,
                        }}
                        loaderPosition='fixed'
                        highlightedRows={getSelectedRows()}
                    />
                </Grid>
            </Grid>

            {isDownload && <CRMLoader />}
        </Paper>
    </RootRef>;
};

export default withStyles(style)(ResumePage);
