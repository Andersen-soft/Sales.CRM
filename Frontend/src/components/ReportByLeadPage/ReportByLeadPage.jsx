// @flow

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { Grid, Paper, RootRef } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { endOfDay, startOfDay } from 'date-fns';
import { getReport } from 'crm-api/reportsByLeadService/reportService';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { FULL_DATE_CS, CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import CalenderFilter from 'crm-components/common/CRMFiltrationComponent/filters/CalenderFilter';
import AutocompleteFilter from 'crm-components/common/CRMFiltrationComponent/filters/AutocompleteFilter';
import AutoCompleteMultiFilter from 'crm-components/common/CRMFiltrationComponent/filters/AutocompliteMultiFilter';
import CheckboxIdFilter from 'crm-components/common/CRMFiltrationComponent/filters/CheckboxIdFilter';
import { getFilters } from 'crm-api/reportsByLeadService/filters/getFilters';
import Calender from 'crm-static/customIcons/calendar.svg';
import {
    PAGE_SIZE,
    columnsVisibleSettings,
    TABLE_COLUMN_FILTER_KEYS,
    LEAD_REPORT,
    CONFIG_VERSION,
} from 'crm-constants/reportsByLead/reportsConstants';
import checkUnfiledValue from 'crm-utils/dataTransformers/checkUnfiledValue';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';
import { HEAD_SALES } from 'crm-roles';
import { UserCell, LinkCell, OuterLinkCell, CollapsedCell } from 'crm-components/common/TableCells';
import PageHeader from './PageHeader';
import RecommendationCell from './Cells/RecommendationCell';
import RequestLinksCell from './Cells/RequestLinksCell';

import type { FiltersType } from 'crm-api/reportsByLeadService/filters/getFilters';

import styles from './ReportByLeadPageStyles';

type Props = {
    classes: Object,
    userData: {
        id: number,
        roles: Array<string>,
    },
}

const ReportByLeadPage = ({
    classes,
    userData: { roles: userRoles, id: userId },
}: Props) => {
    const filterParams = useMemo(() => {
        const params = localStorage.getItem(LEAD_REPORT);

        if (params) {
            return JSON.parse(params, (key, value) => {
                switch (true) {
                    case (key === 'dateRange'):
                        return { from: new Date(value.from), to: new Date(value.to) };
                    case (key === 'statusChangedDate'):
                        return pathOr(false, ['startDate'], value)
                            ? { startDate: new Date(value.startDate), endDate: new Date(value.endDate) }
                            : value;
                    default: return value;
                }
            });
        }

        return {};
    }, []);

    const getVisibleConfig = () => {
        const savedVersion = pathOr(null, ['version'], filterParams);
        const visibleConfig = pathOr(null, ['columnsVisibleSetting'], filterParams);

        return savedVersion !== CONFIG_VERSION ? columnsVisibleSettings : visibleConfig;
    };

    const [leads, setLeads] = useState([]);
    const [leadsCount, setLeadsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [dateRange, setDateRange] = useState(
        pathOr({ from: new Date(), to: new Date() }, ['dateRange'], filterParams)
    );
    const [search, setSearch] = useState(pathOr('', ['search'], filterParams));
    const [filters, setFilters] = useState(pathOr({}, ['filters'], filterParams));
    const [columnsVisibleSetting, setColumsVisibleSettings] = useState(getVisibleConfig());

    const translations = {
        filled: useTranslation('reportByLeadPage.filled'),
        unfilled: useTranslation('reportByLeadPage.unfilled'),
        dateOfCreation: useTranslation('reportByLeadPage.dateOfCreation'),
        source: useTranslation('reportByLeadPage.source'),
        recommendedBy: useTranslation('reportByLeadPage.recommendedBy'),
        company: useTranslation('reportByLeadPage.company'),
        status: useTranslation('reportByLeadPage.status'),
        latestStatusChangeDate: useTranslation('reportByLeadPage.latestStatusChangeDate'),
        responsible: useTranslation('reportByLeadPage.responsible'),
        request: useTranslation('reportByLeadPage.request'),
        requestName: useTranslation('reportByLeadPage.requestName'),
        companySite: useTranslation('reportByLeadPage.companySite'),
        mainContact: useTranslation('reportByLeadPage.mainContact'),
        position: useTranslation('reportByLeadPage.position'),
        emailCorp: useTranslation('reportByLeadPage.emailCorp'),
        socialNetwork: useTranslation('reportByLeadPage.socialNetwork'),
        virtualProfile: useTranslation('reportByLeadPage.virtualProfile'),
        phoneNumber: useTranslation('reportByLeadPage.phoneNumber'),
        emailPers: useTranslation('reportByLeadPage.emailPers'),
        country: useTranslation('reportByLeadPage.country'),
        category: useTranslation('reportByLeadPage.category'),
        industry: useTranslation('reportByLeadPage.industry'),
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

    const fetchLeads = async (
        pageProps?: number = page,
        dateRangeProps: { from: Date, to: Date } = dateRange,
        searchProps?: string = search,
        filtersProps: FiltersType = filters,
    ) => {
        setLoading(true);
        const { content, totalElements } = await getReport({
            page: pageProps,
            ...filtersProps,
            from: getDate(startOfDay(dateRangeProps.from), CRM_FULL_DATE_SERVER_FORMAT),
            to: getDate(endOfDay(dateRangeProps.to), CRM_FULL_DATE_SERVER_FORMAT),
            searchValue: searchProps,
            responsibleIds: userRoles.includes(HEAD_SALES) ? filtersProps.responsibleIds : [userId],
        });

        setLeads(content);
        setLeadsCount(totalElements);
        setLoading(false);
        scrollTop();
    };

    useEffect(() => {
        document.title = 'Lead report';

        fetchLeads();
    }, []);

    const saveParamsToLocalStorage = data => {
        localStorage.setItem(LEAD_REPORT, JSON.stringify({ ...data, version: CONFIG_VERSION }));
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchLeads(newPage);
    };

    const handleChangeDateRange = (from, to) => {
        setPage(0);
        setDateRange({ from, to });
        setFilters({});
        fetchLeads(0, { from, to }, search, {});

        saveParamsToLocalStorage({
            dateRange: { from, to },
            filters: {},
            search,
            columnsVisibleSetting,
        });
    };

    const handleChangeSearch = (searchValue: string) => {
        setPage(0);
        setSearch(searchValue);
        setFilters({});
        fetchLeads(0, dateRange, searchValue, {});

        saveParamsToLocalStorage({
            dateRange,
            filters: {},
            search: searchValue,
            columnsVisibleSetting,
        });
    };

    const prepareData = useMemo(() => leads.map(({
        id,
        createDate,
        sourceName,
        companyRecommendationId,
        companyRecommendationName,
        companyName,
        status,
        statusChangedDate,
        companyResponsibleRmId,
        companyResponsibleRmName,
        deliveryDirector,
        responsibleName,
        responsibleId,
        requestType,
        requestNames,
        companyUrl,
        mainContact,
        contactPosition,
        skype,
        email,
        socialNetwork,
        socialContact,
        phone,
        personalEmail,
        country,
        category,
        industries,
    }) => ({
        id,
        createDate: getDate(createDate, FULL_DATE_CS),
        sourceName,
        companyRecommendationName: [companyRecommendationId, companyRecommendationName],
        companyName: { name: companyName, id, baseURL: '/sales' },
        status,
        statusChangedDate: getDate(statusChangedDate, FULL_DATE_CS) || <CRMEmptyBlock />,
        responsibleRmName: {
            id: (companyResponsibleRmId === -1) ? null : companyResponsibleRmId,
            name: companyResponsibleRmName,
            reloadParent: fetchLeads,
        },
        responsibleName: { id: responsibleId, name: responsibleName, reloadParent: fetchLeads },
        requestType: checkUnfiledValue(requestType) ? <CRMEmptyBlock /> : requestType,
        requestNames,
        companyUrl,
        mainContact: mainContact || <CRMEmptyBlock />,
        category: checkUnfiledValue(category) ? <CRMEmptyBlock /> : category,
        contactPosition: contactPosition || <CRMEmptyBlock />,
        skype: skype || <CRMEmptyBlock />,
        email: email || <CRMEmptyBlock />,
        socialNetwork,
        socialContact: checkUnfiledValue(socialContact) ? <CRMEmptyBlock /> : socialContact,
        phone: phone || <CRMEmptyBlock />,
        personalEmail: personalEmail || <CRMEmptyBlock />,
        country: country || <CRMEmptyBlock />,
        industries: industries && industries.map(({ name: industryName }) => industryName).join(', '),
    })), [leads]);

    const handleSetFilters = (filterKey, filterValue) => {
        setFilters({ ...filters, [filterKey]: filterValue });
        fetchLeads(0, dateRange, search, { ...filters, [filterKey]: filterValue });

        saveParamsToLocalStorage({
            dateRange,
            filters: { ...filters, [filterKey]: filterValue },
            search,
            columnsVisibleSetting,
        });
    };

    const getFilterParamsList = (fieldName, filtersProperty) => getFilters(
        {
            search,
            ...dateRange,
            ...filtersProperty,
            responsibleIds: userRoles.includes(HEAD_SALES) ? filters.responsibleIds : [userId],
        },
        fieldName
    );

    const getCompanies = async filtersProps => {
        const companiesList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.COMPANY, filtersProps);

        return companiesList.map(({ id, name }) => ({ label: name, value: id }));
    };

    const getRecommendationList = async filtersProps => {
        const companiesList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.RECOMMENDATION, filtersProps);

        return companiesList.map(({ id, name }) => ({ label: name, value: name }));
    };

    const getSocialContacts = async filtersProps => {
        const socialContactsList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.SOCIAL_CONTACT, filtersProps);

        return socialContactsList.map(name => ({ label: `${name}`, value: `${name}` }));
    };

    const getCountries = async filtersProps => {
        const countriesList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.COUNTRY, filtersProps);

        return countriesList.map(({ countryName, countryId }) => ({ label: countryName, value: countryId }));
    };

    const getSourceList = async () => {
        const sourceList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.SOURCE);

        return sourceList.map(({ sourceId, sourceName, tooltip }) => ({ id: sourceId, name: sourceName, tooltip }));
    };

    const getStatusList = async () => {
        const statusList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.STATUS);

        return statusList
            .sort(({ statusOrdinal: statusOrdinalPrev }, { statusOrdinal: statusOrdinalNext }) => statusOrdinalPrev - statusOrdinalNext)
            .map(({ status, statusEnumCode }) => ({ id: statusEnumCode, name: status }));
    };

    const getCategoryList = async () => {
        const categoryList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.CATEGORY);

        return categoryList.map(({ category }) => ({ id: category, name: category }));
    };

    const getRequestTypeList = async () => {
        const requestTypeList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.REQUEST_TYPE);

        return requestTypeList
            .sort((
                { reportTypeOrdinal: reportTypeOrdinalPrev },
                { reportTypeOrdinal: reportTypeOrdinalNext }
            ) => reportTypeOrdinalPrev - reportTypeOrdinalNext)
            .map(({ reportType, reportTypeEnumCode }) => ({ id: reportTypeEnumCode, name: reportType }));
    };

    const getFilledUnfilledList = () => [
        { id: 'notNull', name: translations.filled },
        { id: 'null', name: translations.unfilled },
    ];

    const getDeliveryDirectorList = async () => {
        const ddList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.DELIVERY_DIRECTOR);

        return ddList.map(({ id, name }) => ({ label: name, value: id }));
    };

    const getResponsibleList = async () => {
        const responsibleList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.RESPONSIBLE);

        return responsibleList.map(({ id, name }) => ({ label: name, value: id }));
    };

    const getIndustryList = async () => {
        const industryList = await getFilterParamsList(TABLE_COLUMN_FILTER_KEYS.INDUSTRY);

        return industryList.map(({ industryName }) => ({ label: industryName, value: industryName }));
    };

    const getConfig = useMemo(() => {
        const columnsConfig = [
            {
                title: translations.dateOfCreation,
                key: 'createDate',
            },
            {
                title: translations.source,
                key: 'sourceName',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getSourceList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.SOURCE,
                    filters,
                },
            },
            {
                title: translations.recommendedBy,
                key: 'companyRecommendationName',
                RenderCell: RecommendationCell,
                filterParams: {
                    component: AutocompleteFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getRecommendationList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.RECOMMENDATION,
                    filters,
                },
            },
            {
                title: translations.company,
                key: 'companyName',
                RenderCell: LinkCell,
                filterParams: {
                    component: AutocompleteFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getCompanies,
                    filterName: TABLE_COLUMN_FILTER_KEYS.COMPANY,
                    filters,
                },
            },
            {
                title: translations.industry,
                key: 'industries',
                RenderCell: CollapsedCell,
                filterParams: {
                    component: AutoCompleteMultiFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getIndustryList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.INDUSTRY,
                    filters,
                },
            },
            {
                title: translations.status,
                key: 'status',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    filterName: TABLE_COLUMN_FILTER_KEYS.STATUS,
                    getFilterParams: getStatusList,
                    filters,
                },
            },
            {
                title: translations.category,
                key: 'category',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    filterName: TABLE_COLUMN_FILTER_KEYS.CATEGORY,
                    getFilterParams: getCategoryList,
                    filters,
                },
            },
            {
                title: translations.latestStatusChangeDate,
                key: 'statusChangedDate',
                filterParams: {
                    component: CalenderFilter,
                    onSetFilters: handleSetFilters,
                    filters,
                    filterName: TABLE_COLUMN_FILTER_KEYS.STATUS_CHANGE_DATE,
                    customIcon: Calender,
                    customProps: {
                        minDate: dateRange.from,
                        maxDate: new Date(),
                    },
                },
            },
            {
                title: 'Delivery Director',
                key: 'responsibleRmName',
                RenderCell: UserCell,
                filterParams: {
                    component: AutoCompleteMultiFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getDeliveryDirectorList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.DELIVERY_DIRECTOR,
                    filters,
                },
            },
            {
                title: translations.responsible,
                key: 'responsibleName',
                RenderCell: UserCell,
                filterParams: {
                    component: AutoCompleteMultiFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getResponsibleList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.RESPONSIBLE,
                    filters,
                },
            },
            {
                title: translations.request,
                key: 'requestType',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getRequestTypeList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.REQUEST_TYPE,
                    filters,
                },
            },
            {
                title: translations.requestName,
                key: 'requestNames',
                RenderCell: RequestLinksCell,
            },
            {
                title: translations.companySite,
                key: 'companyUrl',
                RenderCell: OuterLinkCell,
            },
            {
                title: translations.mainContact,
                key: 'mainContact',
            },
            {
                title: translations.position,
                key: 'contactPosition',
            },
            {
                title: 'Skype',
                key: 'skype',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getFilledUnfilledList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.SKYPE,
                    filters,
                },
            },
            {
                title: translations.emailCorp,
                key: 'email',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getFilledUnfilledList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.EMAIL,
                    filters,
                },
            },
            {
                title: translations.socialNetwork,
                key: 'socialNetwork',
                RenderCell: OuterLinkCell,
            },
            {
                title: translations.virtualProfile,
                key: 'socialContact',
                filterParams: {
                    component: AutocompleteFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getSocialContacts,
                    filterName: TABLE_COLUMN_FILTER_KEYS.SOCIAL_CONTACT,
                    filters,
                },
            },
            {
                title: translations.phoneNumber,
                key: 'phone',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getFilledUnfilledList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.PHONE,
                    filters,
                },
            },
            {
                title: translations.emailPers,
                key: 'personalEmail',
                filterParams: {
                    component: CheckboxIdFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getFilledUnfilledList,
                    filterName: TABLE_COLUMN_FILTER_KEYS.PERSONAL_EMAIL,
                    filters,
                },
            },
            {
                title: translations.country,
                key: 'country',
                filterParams: {
                    component: AutocompleteFilter,
                    onSetFilters: handleSetFilters,
                    getFilterParams: getCountries,
                    filterName: TABLE_COLUMN_FILTER_KEYS.COUNTRY,
                    filters,
                },
            },
        ];

        return columnsConfig.map(column => ({
            ...column,
            visible: columnsVisibleSetting[column.key],
        }));
    }, [columnsVisibleSetting, filters]);

    const handleChangeColumnVisibility = (key: string) => {
        const visibleConfig = { ...columnsVisibleSetting, [key]: !columnsVisibleSetting[key] };

        setColumsVisibleSettings(visibleConfig);
        saveParamsToLocalStorage({
            dateRange,
            filters,
            search,
            columnsVisibleSetting: visibleConfig,
        });
    };

    return (
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid>
                <PageHeader
                    dateRange={dateRange}
                    handleChangeDateRange={handleChangeDateRange}
                    search={search}
                    handleChangeSearch={handleChangeSearch}
                    getConfig={getConfig}
                    columnsVisible={columnsVisibleSetting}
                    handleChangeColumnVisibility={handleChangeColumnVisibility}
                    userRoles={userRoles}
                    setIsDownload={setLoading}
                    filters={filters}
                />
            </Grid>
            <RootRef rootRef={tableRef}>
                <CRMTable
                    data={prepareData}
                    columnsConfig={getConfig}
                    isLoading={loading}
                    loaderPosition='fixed'
                    paginationParams={{
                        rowsPerPage: PAGE_SIZE,
                        count: leadsCount,
                        onChangePage: handleChangePage,
                        page,
                    }}
                    classes={{
                        root: classes.tableRoot,
                        cell: classes.cell,
                        head: classes.head,
                        headerCell: classes.headerCell,
                        title: classes.title,
                    }}
                    cellClasses={{
                        status: classes.statusCell,
                        value: classes.valueCell,
                        statusChangedDate: classes.changeStatus,
                        industries: classes.industry,
                    }}
                    showRowsCount
                />
            </RootRef>
        </Paper>
    );
};

export default connect(({ session }) => ({
    userData: session.userData,
}))(withStyles(styles)(ReportByLeadPage));
