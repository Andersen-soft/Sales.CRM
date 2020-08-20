// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_SALE_BY_ID: string = 'company_sale/get_sale';
const URL_GET_SOURCES = '/source';
const URL_UPDATE_SALE: string = 'company_sale/update_sale';
const URL_DELETE_SALE: string = 'company_sale/delete_sale';
const URL_CREATE_SALE: string = 'company_sale/create_sale';
const URL_APPROVE_SALE: (id: number) => string = id => `company_sale/${id}/approve_sale`;

export type UpdateSalePayload = {
    companyId?: number,
    nextActivityDate?: ?string,
}

export type CreateSaleBody = {
    company: {
        contact: ?{
            companyId?: number,
            contactPhone?: string,
            countryId?: number,
            email: string,
            firstName: string,
            lastName?: string,
            personalEmail?: string,
            position?: string,
            sex: string,
            skype?: string,
            socialNetworkUserId?: number,
            socialNetwork?: string,
        },
        description?: string,
        name: string,
        phone?: string,
        url?: string,
        responsibleRmId?: number,
    },
    sourceId: number,
    recommendationId: number,
    industryCreateRequestList?: Array<number>,
}

export const getSaleById = (id: number | string) => (
    crmRequest({
        url: URL_GET_SALE_BY_ID,
        params: { id },
        method: 'GET',
    })
);

export const getSources = () => crmRequest({
    url: URL_GET_SOURCES,
    method: 'GET',
});

export const updateSale = (id: number, data?: UpdateSalePayload) => (
    crmRequest({
        url: URL_UPDATE_SALE,
        method: 'PUT',
        params: { id },
        data,
    })
);

export const deleteSale = (id: number) => (
    crmRequest({
        url: URL_DELETE_SALE,
        method: 'DELETE',
        params: { id },
    })
);

export const createSale = (requestBody: CreateSaleBody) => (
    crmRequest({
        url: URL_CREATE_SALE,
        data: requestBody,
    })
);

export const approveSale = (id: number) => crmRequest({
    url: URL_APPROVE_SALE(id),
    method: 'POST',
});
