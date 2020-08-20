// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { PAGE_SIZE } from 'crm-components/NetworkCoordinators/NetworkCoordinators';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';

import type { DateRange } from 'crm-components/NetworkCoordinatorsSalesHead/NetworkCoordinatorsSalesHead';

type SocialAnswer = {
    companyName: string,
    contactId: number,
    countryId: number,
    firstName: string,
    lastName: string,
    linkLead: string,
    message: string,
    sex: string,
}

const URL_POST_SOCIAL_ANSWER = '/social_answer';
const URL_GET_SOCIAL_ANSWER_RATING = '/social_answer/get_ratings_nc_for_nc';
const URL_GET_FULL_SOCIAL_ANSWER_RATING = '/social_answer/get_ratings_nc';
const URL_GET_DOWNLOAD_SOCIAL_ANSWER_RATING = '/social_answer/ratings_nc_csv';

export default (data: SocialAnswer) => (
    crmRequest({
        url: URL_POST_SOCIAL_ANSWER,
        data,
    })
);

export const getSocialAnswerRating = (page: number, sort: string) => crmRequest({
    url: URL_GET_SOCIAL_ANSWER_RATING,
    method: 'GET',
    params: {
        page,
        sort,
        size: PAGE_SIZE,
    },
});

export const getFullSocialAnswerRating = (page: number, sort: string, dateRange: DateRange) => crmRequest({
    url: URL_GET_FULL_SOCIAL_ANSWER_RATING,
    method: 'GET',
    params: {
        page,
        sort,
        size: PAGE_SIZE,
        createdFrom: getDate(dateRange.startDate, FULL_DATE_DS),
        createdTo: getDate(dateRange.endDate, FULL_DATE_DS),
    },
});

export const downloadReport = (dateRange: DateRange, sort: string) => crmRequest({
    url: URL_GET_DOWNLOAD_SOCIAL_ANSWER_RATING,
    method: 'GET',
    params: {
        createdFrom: getDate(dateRange.startDate, FULL_DATE_DS),
        createdTo: getDate(dateRange.endDate, FULL_DATE_DS),
        sort,
    },
});
