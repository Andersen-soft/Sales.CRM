// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import qs from 'qs';
import trimValue from 'crm-utils/trimValue';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

type SalesContactParamsType = {
    createDate?: Array<string>,
    search?: string,
    page?: number,
    assistant?: number | null,
    country?: number | null,
    source?: Array<number> | null,
    status?: Array<string> | null,
    manager?: number | null,
    socialNetworkContact?: number | null,
}

type StatisticsType = {
    createdFrom: string,
    createdTo: string,
}

type FiltrationParams = {
    role?: number,
    status?: Array<string>,
    source?: Array<number>,
    country?: number | null,
    manager?: number | null,
    assistant?: number | null,
    socialNetworkContact?: number | null,
    createDate: Array<string> | null,
    search?: string | null,
    sort?: string | null,
}

type FetchSocialContactsType = {
    ...SalesContactParamsType,
    ...FiltrationParams,
};

type FetchEmployeeType = {
    role: number,
    ...FiltrationParams,
};

const URL_SOCIAL_CONTACTS_SALES_HEAD: string = '/social_answer/head';
const URL_FETCH_CSV_SOCIAL_CONTACTS: string = '/social_answer/head_csv';
const URL_REMOVE_SOCIAL_CONTACT: string = '/social_answer/';
const URL_RETURN_SOCIAL_CONTACT: string = '/social_answer/return';
const URL_SOCIAL_STATICTICS: string = '/social_answer/stat';
const URL_SOCIAL_CONTACTS_SOURCES: string = '/contact/get_source';
const URL_SOCIAL_CONTACTS_CONTACTS: string = '/social_contact';
const URL_SOCIAL_CONTACTS_EMPLOYEES: string = '/employee/get_employees';
const URL_SOCIAL_CONTACTS_COUNTRIES: string = '/country';
const URL_SOCIAL_ANSWER_STATUSES: string = '/social_answer/get_statuses';

const fetchSocialContacts = ({
    createDate,
    search,
    page,
    assistant,
    country,
    source,
    status,
    manager,
    socialNetworkContact,
}: FetchSocialContactsType) => crmRequest({
    url: URL_SOCIAL_CONTACTS_SALES_HEAD,
    method: 'GET',
    params: {
        createDate,
        search: trimValue(search),
        page,
        assistant,
        country,
        source,
        status,
        responsible: manager,
        socialNetworkContact,
        sort: 'createDate,desc',
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchSocialContactsCSV = ({
    createDate,
    search,
    page,
    assistant,
    country,
    source,
    status,
    manager,
    socialNetworkContact,
}: SalesContactParamsType) => crmRequest({
    url: URL_FETCH_CSV_SOCIAL_CONTACTS,
    method: 'POST',
    params: getObjectWithoutEmptyProperties({
        createDate,
        search: trimValue(search),
        page,
        assistant,
        country,
        source,
        status,
        responsible: manager,
        socialNetworkContact,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    responseType: 'blob',
});

const removeSocialContact = (id: number) => crmRequest({
    url: `${URL_REMOVE_SOCIAL_CONTACT}${id}`,
    method: 'DELETE',
});

const returnContactToSale = (id: number) => crmRequest({
    url: URL_RETURN_SOCIAL_CONTACT,
    method: 'POST',
    data: [id],
});

const getSocialContactStatistic = ({
    createdFrom,
    createdTo,
}: StatisticsType) => crmRequest({
    url: URL_SOCIAL_STATICTICS,
    method: 'GET',
    params: {
        createdFrom,
        createdTo,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchSocialContactStatuses = ({
    status,
    assistant,
    manager,
    source,
    socialNetworkContact,
    country,
    createDate,
    search,
}: FiltrationParams) => crmRequest({
    url: URL_SOCIAL_ANSWER_STATUSES,
    method: 'GET',
    params: {
        ...getObjectWithoutEmptyProperties({
            status,
            assistant,
            responsible: manager,
            source,
            socialNetworkContact,
            country,
            createDate,
            search: trimValue(search),
        }),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchSources = ({
    status,
    assistant,
    manager,
    source,
    socialNetworkContact,
    country,
    createDate,
    search,
}: FiltrationParams) => crmRequest({
    url: URL_SOCIAL_CONTACTS_SOURCES,
    method: 'GET',
    params: {
        size: 1000,
        ...getObjectWithoutEmptyProperties({
            'socialAnswer.status': status,
            'socialAnswer.assistant': assistant,
            'socialAnswer.responsible': manager,
            'socialAnswer.source': source,
            'socialAnswer.socialContact': socialNetworkContact,
            'socialAnswer.country': country,
            'socialAnswer.createDate': createDate,
            'socialAnswer.search': trimValue(search),
            sort: 'name,asc',
        }),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchSocialContact = ({
    role,
    status,
    assistant,
    manager,
    source,
    socialNetworkContact,
    country,
    createDate,
    search,
}: FiltrationParams) => crmRequest({
    url: URL_SOCIAL_CONTACTS_CONTACTS,
    method: 'GET',
    params: {
        ...getObjectWithoutEmptyProperties({
            'socialAnswer.status': status,
            'socialAnswer.assistant': assistant,
            'socialAnswer.responsible': manager,
            'socialAnswer.source': source,
            'socialAnswer.socialContact': socialNetworkContact,
            'socialAnswer.country': country,
            'socialAnswer.createDate': createDate,
            'socialAnswer.search': trimValue(search),
            sort: 'socialNetworkUser.name,asc',
        }),
        size: 1000,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchSocialEmployees = ({
    role,
    status,
    assistant,
    manager,
    source,
    socialNetworkContact,
    country,
    createDate,
    search,
}: FetchEmployeeType) => crmRequest({
    url: URL_SOCIAL_CONTACTS_EMPLOYEES,
    method: 'GET',
    params: {
        size: 1000,
        ...getObjectWithoutEmptyProperties({
            'role': role,
            'socialAnswer.status': status,
            'socialAnswer.assistant': assistant,
            'socialAnswer.responsible': manager,
            'socialAnswer.source': source,
            'socialAnswer.socialContact': socialNetworkContact,
            'socialAnswer.country': country,
            'socialAnswer.createDate': createDate,
            'socialAnswer.search': trimValue(search),
            sort: 'lastName,asc',
        }),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const fetchCountries = ({
    status,
    assistant,
    manager,
    source,
    socialNetworkContact,
    country,
    createDate,
    search,
    sort,
}: FiltrationParams) => crmRequest({
    url: URL_SOCIAL_CONTACTS_COUNTRIES,
    method: 'GET',
    params: {
        ...getObjectWithoutEmptyProperties({
            'socialAnswer.status': status,
            'socialAnswer.assistant': assistant,
            'socialAnswer.responsible': manager,
            'socialAnswer.source': source,
            'socialAnswer.socialContact': socialNetworkContact,
            'socialAnswer.country': country,
            'socialAnswer.createDate': createDate,
            'socialAnswer.search': trimValue(search),
            size: 1000,
            sort,
        }),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export {
    fetchSocialContacts,
    fetchSocialContactsCSV,
    removeSocialContact,
    returnContactToSale,
    getSocialContactStatistic,
    fetchSocialContactStatuses,
    fetchSources,
    fetchSocialContact,
    fetchSocialEmployees,
    fetchCountries,
};
