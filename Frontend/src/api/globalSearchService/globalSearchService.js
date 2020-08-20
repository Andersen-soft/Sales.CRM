// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';
import getValueOrNull from 'crm-utils/getValueOrNull';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import { PAGE_SIZE } from 'crm-constants/globalSearch/globalSearchConstants';

const URL_GET_COMPANIES = '/company/get_companies_sorted_by_name';
const URL_GET_CONTACTS = '/contact/get_contacts';
const URL_GET_INDUSTRIES = '/industry/get_industries';

export type CompanyRequestParams = {
    page: number,
    companyName?: string,
    companyUrl?: string,
    companyPhone?: string,
    responsibleRmId?: number | null,
    isFullCompanyInfo?: boolean,
    industry?: ?Array<number>,
}

export type ContactRequestParams = {
    page: number,
    fio?: string,
    email?: string,
    skype?: string,
    socialNetworkLink?: string,
    phone?: string,
    countryId?: number | null,
    dateOfBirth?: ?Array<string>,
}

export const getCompanies = ({
    page,
    companyName,
    companyUrl,
    companyPhone,
    responsibleRmId,
    isFullCompanyInfo,
    industry,
}: CompanyRequestParams,
canceled?: boolean) => crmRequest({
    url: URL_GET_COMPANIES,
    method: 'get',
    params: getObjectWithoutEmptyProperties({
        size: PAGE_SIZE,
        page,
        name: getValueOrNull(companyName),
        url: getValueOrNull(companyUrl),
        phone: getValueOrNull(companyPhone),
        responsibleRmId: getValueOrNull(responsibleRmId),
        isFullCompanyInfo: getValueOrNull(isFullCompanyInfo),
        industry,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
}, canceled);

export const getContacts = ({
    page,
    fio,
    email,
    skype,
    socialNetworkLink,
    phone,
    countryId,
    dateOfBirth,
}: ContactRequestParams) => crmRequest({
    url: URL_GET_CONTACTS,
    method: 'get',
    params: getObjectWithoutEmptyProperties({
        size: PAGE_SIZE,
        page,
        fio: getValueOrNull(fio),
        emails: getValueOrNull(email),
        skype: getValueOrNull(skype),
        socialNetwork: getValueOrNull(socialNetworkLink),
        phone: getValueOrNull(phone),
        country: getValueOrNull(countryId),
        dateOfBirth,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getIndustries = () => crmRequest({
    url: URL_GET_INDUSTRIES,
    method: 'get',
});
