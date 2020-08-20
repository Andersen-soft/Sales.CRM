// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import trimValue from 'crm-utils/trimValue';
import { ARCHIVE } from 'crm-constants/desktop/statuses';

const URL_GET_COMPANY_CARD: string = 'company/get_company';
const URL_UPDATE_COMPANY_CARD: string = 'company/update_company';
const URL_GET_COMPANY_SEARCH: string = 'company/name_filter';
const URL_GET_COMPANY_GLOBAL_SEARCH: string = 'company/get_companies_sorted_by_name';
const URL_GET_CONTACTS: string = '/contact/get_contacts';
const URL_GET_SALES: string = '/company_sale';
const URL_CHECK_EXIST_COMPANY: string = '/company/get_company_by_name';
const URL_GET_INDUSTRY: string = '/industry/get_industries';
const SALES_COUNT = 50;

type Request = {
    description?: string,
    name?: string,
    phone?: string,
    url?: string,
    responsibleRmId?: number,
    industry?: Array<number>,
}

export const getCompanyCard = (companyId: number) => crmRequest({
    url: URL_GET_COMPANY_CARD,
    method: 'GET',
    params: {
        id: companyId,
    },
});

export const updateCompany = (companyId: number, data: Request) => (
    crmRequest({
        url: URL_UPDATE_COMPANY_CARD,
        method: 'PUT',
        params: { id: companyId },
        data,
    })
);

export const getCompaniesSearch = (value: string | void, size: number, canceled?: boolean = false) => {
    const filter = trimValue(value);

    return crmRequest({
        url: URL_GET_COMPANY_SEARCH,
        method: 'GET',
        params: {
            filter,
            size,
            sort: 'name,asc',
        },
    }, canceled);
};

export const getCompaniesGlobalSearch = (value: string | void, size: number, canceled?: boolean = false) => {
    const name = trimValue(value);

    return crmRequest({
        url: URL_GET_COMPANY_GLOBAL_SEARCH,
        method: 'GET',
        params: {
            name,
            size,
            sort: 'name,asc',
        },
    }, canceled);
};

export const checkExistCompany = (companyName: string) => crmRequest({
    url: URL_CHECK_EXIST_COMPANY,
    method: 'GET',
    params: { name: companyName },
});

export const getContacts = (companyId: number) => crmRequest({
    url: URL_GET_CONTACTS,
    method: 'GET',
    params: {
        company: companyId,
    },
});

export const getSales = (responsible: number, company: number) => crmRequest({
    url: URL_GET_SALES,
    method: 'GET',
    params: {
        responsible,
        company,
        isActive: true,
        sort: 'createDate,desc',
        excludedStatus: ARCHIVE,
        size: SALES_COUNT,
    },
});

export const getIndustries = () => crmRequest({
    url: URL_GET_INDUSTRY,
    method: 'GET',
});
