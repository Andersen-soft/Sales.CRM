// @flow

import qs from 'qs';
import { startOfDay, endOfDay } from 'date-fns';
import crmRequest from 'crm-helpers/api/crmRequest';

import { PAGE_SIZE } from 'crm-constants/reportsByLead/reportsConstants';
import { getDate } from 'crm-utils/dates';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';

const URL_GET_REPORTS: string = '/company_sale/reports';
const URL_GET_STATISTIC: string = '/company_sale/get_stat';
const URL_DOWNLOAD_REPORT: string = '/company_sale/reports/download';
const URL_GET_COMPANY: string = 'company/get_company';

export type fetchReportArguments = {
    from: string,
    to: string,
    page: number,
    searchValue?: string,
    sourceId?: Array<number>,
    statusId?: Array<string>,
    companyId?: number,
    statusChangedDate?: {
        startDate: Date,
        endDate: Date,
    },
    countryId?: number,
    socialContactName?: string,
    type?: Array<string>,
    skype?: Array<string>,
    email?: Array<string>,
    phone?: Array<string>,
    personalEmail?: Array<string>,
    recommendationName?: string,
    deliveryDirectorIds:? Array<number>,
    responsibleIds?: Array<number>,
    categoryId?: Array<string>,
    industry?: Array<string>,
}

export type fetchStatisticArguments = {
    from: string,
    to: string,
}

export type VisibleColumnsConfig = {
    createDate?: boolean,
    sourceName?: boolean,
    recommendation?: boolean,
    companyName?: boolean,
    status?: boolean,
    statusChangedDate?: boolean,
    deliveryDirector?: boolean,
    responsibleName?: boolean,
    requestType?: boolean,
    requestNames?: boolean,
    companyUrl?: boolean,
    mainContact?: boolean,
    contactPosition?: boolean,
    skype?: boolean,
    email?: boolean,
    socialNetwork?: boolean,
    socialContact?: boolean,
    phone?: boolean,
    personalEmail?: boolean,
    country?: boolean,
    category?: boolean,
}

type Filters = {
    from: Date,
    to: Date,
    searchValue?: string,
    sourceId?: Array<number>,
    statusId?: Array<string>,
    companyId?: number,
    statusChangedDate?: {
        startDate: Date,
        endDate: Date,
    },
    countryId?: number,
    socialContactName?: string,
    type?: Array<string>,
    skype?: Array<string>,
    email?: Array<string>,
    phone?: Array<string>,
    personalEmail?: Array<string>,
    recommendationName?: string,
    deliveryDirectorIds?: Array<number>,
    responsibleIds?: Array<number>,
    categoryId?: Array<string>,
}

export const getReport = ({
    from,
    to,
    page,
    searchValue,
    sourceId,
    statusId,
    companyId,
    statusChangedDate,
    countryId,
    socialContactName,
    type,
    skype,
    email,
    phone,
    personalEmail,
    recommendationName,
    deliveryDirectorIds,
    responsibleIds,
    categoryId,
    industry,
}: fetchReportArguments) => crmRequest({
    url: URL_GET_REPORTS,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        page,
        size: PAGE_SIZE,
        createDate: [from, to],
        search: searchValue,
        sourceId,
        status: statusId,
        companyId,
        statusChangedDate: statusChangedDate && [
            getDate(startOfDay(statusChangedDate.startDate), CRM_FULL_DATE_SERVER_FORMAT),
            getDate(endOfDay(statusChangedDate.endDate), CRM_FULL_DATE_SERVER_FORMAT),
        ],
        countryId,
        socialContactName,
        type,
        skype,
        email,
        phone,
        personalEmail,
        companyRecommendationName: recommendationName,
        companyResponsibleRmId: deliveryDirectorIds,
        responsibleId: responsibleIds,
        category: categoryId,
        companyIndustries: industry,
        sort: 'createDate,desc',
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getStatistics = ({
    from,
    to,
}: fetchStatisticArguments) => crmRequest({
    url: URL_GET_STATISTIC,
    method: 'GET',
    params: {
        creationFrom: from,
        creationTo: to,
    },
});

export const downloadReport = (
    columns: VisibleColumnsConfig,
    {
        from,
        to,
        searchValue,
        sourceId,
        statusId,
        companyId,
        statusChangedDate,
        countryId,
        socialContactName,
        type,
        skype,
        email,
        phone,
        personalEmail,
        recommendationName,
        deliveryDirectorIds,
        responsibleIds,
        categoryId,
    }: Filters
) => crmRequest({
    url: URL_DOWNLOAD_REPORT,
    data: columns,
    params: getObjectWithoutEmptyProperties({
        companyId,
        countryId,
        createDate: [from, to],
        responsibleId: responsibleIds,
        search: searchValue,
        socialContactName,
        sourceId,
        status: statusId,
        statusChangedDate: statusChangedDate && [
            getDate(startOfDay(statusChangedDate.startDate), CRM_FULL_DATE_SERVER_FORMAT),
            getDate(endOfDay(statusChangedDate.endDate), CRM_FULL_DATE_SERVER_FORMAT),
        ],
        type,
        skype,
        email,
        phone,
        personalEmail,
        companyRecommendationName: recommendationName,
        companyResponsibleRmId: deliveryDirectorIds,
        category: categoryId,
    }),
    responseType: 'blob',
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getCompany = (companyId: number) => crmRequest({
    url: URL_GET_COMPANY,
    method: 'GET',
    params: {
        id: companyId,
    },
});
