// @flow

import React, {
    useEffect, useState, useRef, useContext, useMemo,
} from 'react';
import {
    Paper,
    Grid,
    RootRef,
} from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { IsLanguageContext } from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';
import { LOCALE_EN } from 'crm-constants/locale';
import {
    fetchSocialContacts,
    fetchSocialContactStatuses,
    fetchSocialEmployees,
    fetchSources,
    fetchSocialContact,
    fetchCountries,
    returnContactToSale,
} from 'crm-api/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_CS, CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import {
    PAGE_SIZE,
    ASSISTANT_KEY,
    STATUS_KEY,
    SOURCE_KEY,
    ALL_SOCIAL_CONTACTS_FILTERS,
} from 'crm-constants/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import { NETWORK_COORDINATOR_ID, SALE_ID } from 'crm-constants/roles';
import clearMultipleSpace from 'crm-utils/dataTransformers/clearMultipleSpace';
import {
    AutocompleteFilter,
    CheckboxFilter,
    CheckboxIdFilter,
} from 'crm-components/common/CRMFiltrationComponent';
import { UserCell, CollapsedCell } from 'crm-components/common/TableCells';
import PageHeader from './PageHeader';
import SocialNetworkCell from './Cells/SocialNetworkCell';
import StatusActionCell from './Cells/StatusActionCell';
import GenderCell from './Cells/GenderCell';
import CancelConfirmation from 'crm-components/common/CancelConfirmation/CancelConfirmation';

import styles from './ReportBySocialContactsSalesHeadStyles';

type Props = {
    classes: Object,
}

type RequestParams = {
    pageProps?: number,
    dateRangeProps?: {
        startDate: Date,
        endDate: Date,
    },
    searchProps?: string,
    filtersProps?: {
        assistant?: number | null,
        country?: number | null,
        source?: Array<number> | null,
        status?: Array<string> | null,
        manager?: number | null,
        socialNetworkContact?: number | null,
    },
};

const ReportBySocialContactsSalesHead = ({
    classes,
}: Props) => {
    const filterParams = useMemo(() => {
        const params = localStorage.getItem(ALL_SOCIAL_CONTACTS_FILTERS);

        return params ? JSON.parse(params) : {};
    }, []);

    const [dateRange, setDateRange] = useState(pathOr({
        startDate: new Date(),
        endDate: new Date(),
    }, ['dateRange'], filterParams));
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState(pathOr({}, ['filters'], filterParams));
    const [search, setSearch] = useState(pathOr('', ['search'], filterParams));
    const [isDownload, setIsDownload] = useState(false);
    const [undoAnswerId, setUndoAnswerId] = useState(null);

    const translations = {
        status: useTranslation('allSocialNetworkAnswers.status'),
        createDate: useTranslation('allSocialNetworkAnswers.createDate'),
        assistant: useTranslation('allSocialNetworkAnswers.assistant'),
        responsible: useTranslation('allSocialNetworkAnswers.responsible'),
        source: useTranslation('allSocialNetworkAnswers.source'),
        socialNetworkContact: useTranslation('allSocialNetworkAnswers.socialNetworkContact'),
        message: useTranslation('allSocialNetworkAnswers.message'),
        linkLead: useTranslation('allSocialNetworkAnswers.linkLead'),
        firstName: useTranslation('allSocialNetworkAnswers.firstName'),
        lastName: useTranslation('allSocialNetworkAnswers.lastName'),
        sex: useTranslation('allSocialNetworkAnswers.sex'),
        country: useTranslation('allSocialNetworkAnswers.country'),
        companyName: useTranslation('allSocialNetworkAnswers.companyName'),
        confirmText: useTranslation('allSocialNetworkAnswers.confirmText'),
    };

    const tableRef = useRef();

    const filtrationParams = useRef(filterParams);

    const { locale } = useContext(IsLanguageContext);

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

    const getSocialAnswer = async ({
        pageProps = page,
        dateRangeProps = dateRange,
        searchProps = search,
        filtersProps = filters,
    }: RequestParams) => {
        setLoading(true);
        const { content, totalElements } = await fetchSocialContacts({
            page: pageProps,
            createDate: [
                getDate(dateRangeProps.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRangeProps.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(searchProps),
            ...filtersProps,
        });

        setAnswers(content);
        setTotalCount(totalElements);
        setLoading(false);
    };

    const saveFiltersParams = () => {
        if (filtrationParams && filtrationParams.current) {
            const filtersParams = filtrationParams.current;

            localStorage.setItem(ALL_SOCIAL_CONTACTS_FILTERS, JSON.stringify(filtersParams));
        }
    };

    useEffect(() => {
        getSocialAnswer({});

        return saveFiltersParams;
    }, []);

    const handleSelectRange = (startDate, endDate) => {
        if (startDate && endDate) {
            setPage(0);
            setDateRange({ startDate, endDate });
            filtrationParams.current = {
                ...filtrationParams.current,
                dateRange: { startDate, endDate },
            };
        }

        getSocialAnswer({ pageProps: 0, dateRangeProps: { startDate, endDate } });
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        getSocialAnswer({ pageProps: newPage });
        scrollTop();
    };

    const handleSetFilters = (fieldName: string, filterValue: number | string | Array<string> | Array<number>) => {
        setFilters(item => ({ ...item, [fieldName]: filterValue }));
        setPage(0);
        getSocialAnswer({
            pageProps: 0,
            dateRangeProps: dateRange,
            searchProps: search,
            filtersProps: { ...filters, [fieldName]: filterValue },
        });

        filtrationParams.current = {
            ...filtrationParams.current,
            filters: { ...filters, [fieldName]: filterValue },
        };
    };

    const getRequestFunction = (filterName: string) => {
        switch (true) {
            case (filterName === STATUS_KEY):
                return fetchSocialContactStatuses;
            case (filterName === SOURCE_KEY):
                return fetchSources;
            default: return null;
        }
    };

    const getRawList = (filtersProps, filterName) => {
        const getItems = getRequestFunction(filterName);

        return getItems && getItems({
            createDate: [
                getDate(dateRange.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRange.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(search),
            ...filters,
        });
    };

    const getUserList = async (filterProps, filterName) => {
        const role = filterName === ASSISTANT_KEY ? NETWORK_COORDINATOR_ID : SALE_ID;

        const { content } = await fetchSocialEmployees({
            role,
            createDate: [
                getDate(dateRange.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRange.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(search),
            ...filters,
        });

        return content.map(({ id, firstName, lastName }) => ({ label: `${firstName} ${lastName}`, value: id }));
    };

    const getSocialContactList = async () => {
        const { content } = await fetchSocialContact({
            createDate: [
                getDate(dateRange.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRange.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(search),
            ...filters,
        });

        return content.map(({ id, socialNetworkUser: { name } }) => ({ label: name, value: id }));
    };

    const getCountryList = async () => {
        const { content } = await fetchCountries({
            createDate: [
                getDate(dateRange.startDate, CRM_FULL_DATE_SERVER_FORMAT),
                getDate(dateRange.endDate, CRM_FULL_DATE_SERVER_FORMAT),
            ],
            search: clearMultipleSpace(search),
            ...filters,
            sort: locale === LOCALE_EN ? 'nameEn,asc' : 'nameRu,asc',
        });

        return content.map(({ id, name }) => ({ label: name, value: id }));
    };

    const undoReplies = async () => {
        if (undoAnswerId) {
            await returnContactToSale(undoAnswerId);
            setUndoAnswerId(null);
            getSocialAnswer({});
        }
    };

    const applySearch = (searchValue: string) => {
        setFilters({});
        setSearch(searchValue);
        setPage(0);
        getSocialAnswer({
            pageProps: 0,
            dateRangeProps: dateRange,
            searchProps: searchValue,
            filtersProps: {},
        });
        filtrationParams.current = {
            ...filtrationParams.current,
            search: searchValue,
        };
    };

    const config = [
        {
            title: translations.status,
            key: STATUS_KEY,
            RenderCell: StatusActionCell,
            filterParams: {
                component: CheckboxFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getRawList,
                filters,
            },
        },
        {
            title: translations.createDate,
            key: 'createDate',
        },
        {
            title: translations.assistant,
            key: ASSISTANT_KEY,
            RenderCell: UserCell,
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getUserList,
                filters,
            },
        },
        {
            title: translations.responsible,
            key: 'manager',
            RenderCell: UserCell,
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getUserList,
                filters,
            },
        },
        {
            title: translations.source,
            key: SOURCE_KEY,
            filterParams: {
                component: CheckboxIdFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getRawList,
                filters,
            },
        },
        {
            title: translations.socialNetworkContact,
            key: 'socialNetworkContact',
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getSocialContactList,
                filters,
            },
        },
        {
            title: translations.message,
            key: 'message',
            RenderCell: CollapsedCell,
        },
        {
            title: translations.linkLead,
            key: 'linkLead',
            RenderCell: SocialNetworkCell,
        },
        {
            title: translations.firstName,
            key: 'firstName',
        },
        {
            title: translations.lastName,
            key: 'lastName',
        },
        {
            title: translations.sex,
            key: 'sex',
            RenderCell: GenderCell,
        },
        {
            title: translations.country,
            key: 'country',
            filterParams: {
                component: AutocompleteFilter,
                onSetFilters: handleSetFilters,
                getFilterParams: getCountryList,
                filters,
            },
        },
        {
            title: translations.companyName,
            key: 'companyName',
        },
    ];

    const prepareData = rawData => rawData.map(({
        id,
        status,
        createDate,
        assistant,
        assistantId,
        responsible,
        responsibleId,
        source,
        socialNetworkContact,
        message,
        linkLead,
        firstName,
        lastName,
        sex,
        country,
        companyName,
    }) => ({
        id,
        status: [id, status, setUndoAnswerId],
        createDate: getDate(createDate, FULL_DATE_CS),
        assistant: { name: assistant, id: assistantId, reloadParent: getSocialAnswer },
        manager: { name: responsible, id: responsibleId, reloadParent: getSocialAnswer },
        source,
        socialNetworkContact,
        message,
        linkLead,
        firstName,
        lastName,
        sex,
        country,
        companyName,
    }));

    const getManagerName = () => {
        if (undoAnswerId) {
            const answer = answers.find(({ id }) => id === undoAnswerId);

            return answer ? answer.responsible : '';
        }

        return '';
    };

    return (
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid>
                <PageHeader
                    setDownload={setIsDownload}
                    dateRange={dateRange}
                    search={search}
                    filters={filters}
                    handleSelectRange={handleSelectRange}
                    applySearch={applySearch}
                />
            </Grid>
            <RootRef rootRef={tableRef}>
                <CRMTable
                    columnsConfig={config}
                    data={prepareData(answers)}
                    isLoading={loading}
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
                        count: totalCount,
                        onChangePage: handleChangePage,
                    }}
                    loaderPosition='fixed'
                    cellClasses={{
                        status: classes.status,
                        message: classes.messages,
                        socialNetworkContact: classes.virtualProfile,
                        companyName: classes.company,
                    }}
                />
            </RootRef>
            {isDownload && <CRMLoader />}
            <CancelConfirmation
                showConfirmationDialog={Boolean(undoAnswerId)}
                onConfirmationDialogClose={() => setUndoAnswerId(null)}
                onConfirm={undoReplies}
                text={`${translations.confirmText} ${getManagerName()}?`}
                textAlignCenter
            />
        </Paper>
    );
};

export default withStyles(styles)(ReportBySocialContactsSalesHead);
