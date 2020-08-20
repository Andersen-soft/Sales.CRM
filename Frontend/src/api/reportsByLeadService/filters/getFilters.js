// @flow

import qs from 'qs';
import { startOfDay, endOfDay } from 'date-fns';
import crmRequest from 'crm-helpers/api/crmRequest';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import { TABLE_COLUMN_FILTER_KEYS } from 'crm-constants/reportsByLead/reportsConstants';
import trimValue from 'crm-utils/trimValue';

const URL_GET_COMPANY: string = '/company/get_sale_report_companies';
const URL_GET_RECOMMENDATION_COMPANY: string = '/company_sale/get_report_recommendations';
const URL_GET_DELIVERY_DIRECTOR: string = '/company_sale/get_report_dds';
const URL_GET_SOCIAL_CONTACT: string = '/social_user/get_sale_report_users';
const URL_GET_COUNTRY: string = '/country/get_sale_report_countries';
const URL_GET_EMPLOYE: string = '/employee/get_report_employees';
const URL_GET_SOURCE: string = '/source/get_report_sources';
const URL_GET_STATUSES: string = '/company_sale/get_report_statuses';
const URL_GET_REQUEST_TYPE: string = '/company_sale/get_report_types';
const URL_GET_CATEGORY: string = '/company_sale/get_sale_categories';
const URL_GET_INDUSTRY: string = '/industry/get_report_industries';

export type FiltersType = {
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
    industry?: Array<string>,
}

type DateRange = { from: Date, to: Date }

type Arguments = FiltersType & DateRange;

const getUrl = key => {
    switch (key) {
        case TABLE_COLUMN_FILTER_KEYS.COMPANY:
            return URL_GET_COMPANY;
        case TABLE_COLUMN_FILTER_KEYS.RECOMMENDATION:
            return URL_GET_RECOMMENDATION_COMPANY;
        case TABLE_COLUMN_FILTER_KEYS.DELIVERY_DIRECTOR:
            return URL_GET_DELIVERY_DIRECTOR;
        case TABLE_COLUMN_FILTER_KEYS.SOCIAL_CONTACT:
            return URL_GET_SOCIAL_CONTACT;
        case TABLE_COLUMN_FILTER_KEYS.COUNTRY:
            return URL_GET_COUNTRY;
        case TABLE_COLUMN_FILTER_KEYS.RESPONSIBLE:
            return URL_GET_EMPLOYE;
        case TABLE_COLUMN_FILTER_KEYS.SOURCE:
            return URL_GET_SOURCE;
        case TABLE_COLUMN_FILTER_KEYS.STATUS:
            return URL_GET_STATUSES;
        case TABLE_COLUMN_FILTER_KEYS.REQUEST_TYPE:
            return URL_GET_REQUEST_TYPE;
        case TABLE_COLUMN_FILTER_KEYS.CATEGORY:
            return URL_GET_CATEGORY;
        case TABLE_COLUMN_FILTER_KEYS.INDUSTRY:
            return URL_GET_INDUSTRY;
        default:
            return null;
    }
};

const getDefaultSort = key => {
    switch (key) {
        case TABLE_COLUMN_FILTER_KEYS.COMPANY:
            return 'companyName,asc';
        case TABLE_COLUMN_FILTER_KEYS.SOCIAL_CONTACT:
            return 'socialContactName,asc';
        case TABLE_COLUMN_FILTER_KEYS.COUNTRY:
            return 'countryName,asc';
        case TABLE_COLUMN_FILTER_KEYS.RESPONSIBLE:
            return 'responsibleName,asc';
        case TABLE_COLUMN_FILTER_KEYS.SOURCE:
            return 'sourceName,asc';
        case TABLE_COLUMN_FILTER_KEYS.STATUS:
            return 'status,desc';
        case TABLE_COLUMN_FILTER_KEYS.REQUEST_TYPE:
            return 'type,asc';
        case TABLE_COLUMN_FILTER_KEYS.RECOMMENDATION:
            return 'companyRecommendationName,asc';
        case TABLE_COLUMN_FILTER_KEYS.DELIVERY_DIRECTOR:
            return 'companyResponsibleRmName,asc';
        case TABLE_COLUMN_FILTER_KEYS.CATEGORY:
            return 'category,asc';
        default:
            return null;
    }
};

export const getFilters = ({
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
    industry,
}: Arguments, key: string) => crmRequest({
    url: getUrl(key),
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        size: 500,
        createDate: [
            getDate(startOfDay(from), CRM_FULL_DATE_SERVER_FORMAT),
            getDate(endOfDay(to), CRM_FULL_DATE_SERVER_FORMAT),
        ],
        search: trimValue(searchValue),
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
        sort: getDefaultSort(key),
        category: categoryId,
        industry,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
}).then(response => response.content);
