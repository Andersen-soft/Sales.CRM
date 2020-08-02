// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_CONTACTS: string = '/contact/get_contacts';
const URL_UPDATE_CONTACTS: string = '/contact/update_contact';
const URL_DELETE_CONTACTS: string = '/contact/delete_contact';
const URL_CREATE_CONTACTS: string = '/contact/create_contact';
const URL_GET_COUNTRY: string = '/country';
const URL_GET_AUTH_USER_SOCIAL_CONTACTS: string = '/social_contact';
const URL_GET_CONTACT_SOURCE: string = '/contact/get_source';
const URL_GET_SALES: string = '/company_sale';

type updateActivityData = {
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id?: number;
    responsibleName?: string;
    types: Array<string>;
}

type newContactTypes = {
    companyId: number,
    contactPhone: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    personalEmail: string,
    position: string,
    skype: string,
    socialContact: string,
    socialNetwork: string,
    source: string,
    sourceId: number,
    tool: string,
}

type AuthUserSocialContactsParams = {
    username?: null | string,
    salesAssistantUsername?: null | string,
    sort?: null | string,
}

export const getContacts = (companyId: number) => crmRequest({
    url: URL_GET_CONTACTS,
    method: 'GET',
    params: {
        company: companyId,
        sort: 'id,desc',
    },
});

export const updateContacts = (contactId: number, data: updateActivityData) => crmRequest({
    url: URL_UPDATE_CONTACTS,
    method: 'PUT',
    params: { id: contactId },
    data,
    headers: { 'content-type': 'application/json' },
});

export const deleteContacts = (contactId: number) => crmRequest({
    url: URL_DELETE_CONTACTS,
    method: 'DELETE',
    params: { id: contactId },
    headers: { 'content-type': 'application/json' },
});

export const createContacts = (newContactResponse: newContactTypes) => crmRequest({
    url: URL_CREATE_CONTACTS,
    data: newContactResponse,
});

export const getCountry = () => crmRequest({
    url: URL_GET_COUNTRY,
    method: 'GET',
    params: {
        size: 1000,
        sort: 'nameEn,asc',
    },
}).then(response => response.content);

export const getAuthUserSocialContacts = ({
    username,
    salesAssistantUsername,
    sort = '',
}: AuthUserSocialContactsParams) => crmRequest({
    url: URL_GET_AUTH_USER_SOCIAL_CONTACTS,
    params: {
        'sales.login': username,
        'salesAssistant.login': salesAssistantUsername,
        size: 500,
        sort,
    },
    method: 'GET',
});

export const getContactSource = () => crmRequest({
    url: URL_GET_CONTACT_SOURCE,
    method: 'GET',
});

export const getSalesWithMainContact = (mainContact: number) => crmRequest({
    url: URL_GET_SALES,
    method: 'GET',
    params: {
        mainContact,
        sort: 'id,desc',
    },
});
