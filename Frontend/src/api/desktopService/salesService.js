// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import qs from 'qs';
import { PAGE_SIZE, pageSizeModals } from 'crm-constants/desktop/salesConstants';
import { ARCHIVE, OVERDUE_ACTIVITIES } from 'crm-constants/desktop/statuses';
import getStatusFilter from 'crm-utils/dataTransformers/sales/getStatusFilter';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

export type fetchSalesArguments = {
    isFirstRequest?: ?boolean,
    search?: ?string,
    activityDate?: ?Array<*> | string,
    page?: ?number,
    size?: ?number,
    statusFilter?: Array<string>,
    userId?: ?number,
    dayDistributionEmployeeId?: number,
    inDayAutoDistribution?: boolean,
}

const URL_GET_SALES = '/company_sale';
const URL_GET_SALES_COUNT_BY_STATUSES: string = 'company_sale/get_sales_count_by_statuses';
const URL_GET_SALES_WITH_PAST_ACTIVITIES_COUNT:
    string = '/company_sale/get_authorized_user_sales_with_past_activities_count';
let countPagesRequestArchived: number = 0;

export const getSales = ({
    statusFilter,
    activityDate,
    search,
    size,
    page,
    userId,
    dayDistributionEmployeeId = null,
    inDayAutoDistribution = null,
}: fetchSalesArguments, canceled?: boolean = false) => {
    const isPastActivity = (statusFilter && statusFilter.includes(OVERDUE_ACTIVITIES));

    return crmRequest({
        url: URL_GET_SALES,
        method: 'GET',
        params: getObjectWithoutEmptyProperties({
            status: (statusFilter && !isPastActivity) ? getStatusFilter(statusFilter) : null,
            nextActivityDate: activityDate,
            search,
            size: size || PAGE_SIZE,
            page,
            sort: isPastActivity ? 'nextActivityDate,desc' : ['status,asc', 'createDate,desc'],
            isActive: true,
            responsible: userId,
            excludedStatus: statusFilter && statusFilter.includes(ARCHIVE) ? null : ARCHIVE,
            isPastActivity: isPastActivity || null,
            dayDistributionEmployeeId,
            inDayAutoDistribution,
        }),
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    }, canceled);
};

export const getArchivedSales = ({
    isFirstRequest, search, activityDate, userId,
}: fetchSalesArguments) => {
    let result;

    if (isFirstRequest) {
        countPagesRequestArchived = 1;
        result = crmRequest({
            url: URL_GET_SALES,
            method: 'GET',
            params: {
                page: 0,
                size: pageSizeModals,
                status: ARCHIVE,
                search,
                lastActivityDate: activityDate,
                sort: 'lastActivity.dateActivity,desc',
                isActive: true,
                responsible: userId,
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        });
    } else {
        result = crmRequest({
            url: URL_GET_SALES,
            method: 'GET',
            params: {
                page: countPagesRequestArchived,
                size: pageSizeModals,
                status: ARCHIVE,
                search,
                lastActivityDate: activityDate,
                sort: 'lastActivity.dateActivity,desc',
                isActive: true,
                responsible: userId,
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        }).then(response => {
            countPagesRequestArchived += 1;
            return response;
        });
    }

    return result;
};

export const getSalesWithPastActivities = ({
    activityDate,
    search,
    page,
    size,
    userId,
}: fetchSalesArguments) => crmRequest({
    url: URL_GET_SALES,
    method: 'GET',
    params: {
        page,
        size: size || pageSizeModals,
        nextActivityDate: activityDate,
        search,
        sort: 'nextActivityDate,desc',
        isActive: true,
        responsible: userId,
        excludedStatus: ARCHIVE,
        isPastActivity: true,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getSalesCountByStatuses = () => crmRequest({
    url: URL_GET_SALES_COUNT_BY_STATUSES,
    method: 'GET',
});

export const getPastActivitiesCount = () => crmRequest({
    url: URL_GET_SALES_WITH_PAST_ACTIVITIES_COUNT,
    method: 'GET',
});
