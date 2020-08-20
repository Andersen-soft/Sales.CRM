// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { SALE_ID, NETWORK_COORDINATOR_ID } from 'crm-constants/roles';

import {
    PAGE_SIZE,
} from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';

const URL_GET_CONTACTS: string = '/social_contact';
const URL_ADD_CONTACTS: string = '/social_contact';
const URL_DELETE_CONTACT: string = '/social_contact';
const URL_UPDATE_CONTACT: string = '/social_contact';
const URL_GET_SOC_USER: string = '/social_user';
const URL_GET_SOURCES: string = '/social_contact/sources';
const URL_GET_EMPLOYEES: string = '/employee/get_employees';
const URL_CREATE_SOC_NETWORK_USER: string = '/social_user';
const URL_CREATE_SOC_NETWORK: string = '/contact/create_source';

export const getContacts = (page: number, query?: string) => crmRequest({
    url: URL_GET_CONTACTS,
    method: 'GET',
    params: {
        size: PAGE_SIZE,
        page,
        sort: 'createDate,desc',
        searchQuery: query,
    },
});

type ContactUpdate = {
    idContact: number,
    assistantId: ?number,
    saleId: ?number,
    socUserId: ?number,
    socUserName: ?string,
    sourceId: ?number,
    sourceName: ?string,
};

type ContactAdd = {
    assistantId: number,
    saleId: number,
    socUserId: number,
    socUserName: string,
    sourceId: number,
    sourceName: string,
};

export const addContact = ({
    assistantId,
    saleId,
    socUserId,
    socUserName,
    sourceId,
    sourceName,
}: ContactAdd) => crmRequest({
    url: URL_ADD_CONTACTS,
    data: {
        salesAssistant: { id: assistantId },
        sales: { id: saleId },
        socialNetworkUser: {
            id: socUserId,
            name: socUserName,
        },
        source: {
            id: sourceId,
            name: sourceName,
            type: 'Социальная сеть',
        },
    },
});

export const updateContact = ({
    idContact,
    assistantId,
    saleId,
    socUserId,
    socUserName,
    sourceId,
    sourceName,
}: ContactUpdate) => crmRequest({
    url: `${URL_UPDATE_CONTACT}/${idContact}`,
    method: 'PUT',
    data: {
        id: idContact,
        salesAssistant: { id: assistantId },
        sales: { id: saleId },
        socialNetworkUser: {
            id: socUserId,
            name: socUserName,
        },
        source: {
            id: sourceId,
            name: sourceName,
            type: 'Социальная сеть',
        },
    },
});

export const deleteContact = (idContact: number) => crmRequest({
    url: `${URL_DELETE_CONTACT}/${idContact}`,
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
});

export const getSocUser = () => crmRequest({
    url: URL_GET_SOC_USER,
    method: 'GET',
    params: {
        size: 500,
        sort: 'name,asc',
    },
});

export const getSources = () => crmRequest({
    url: URL_GET_SOURCES,
    method: 'GET',
    params: { sort: 'name,asc' },
});

export const getSales = () => crmRequest({
    url: URL_GET_EMPLOYEES,
    method: 'GET',
    params: {
        isActive: 'true',
        size: 500,
        role: SALE_ID,
    },
    multiParams: {
        sort: ['lastName,asc', 'firstName,asc'],
    },
});

export const getNetworkCoordinator = () => crmRequest({
    url: URL_GET_EMPLOYEES,
    method: 'GET',
    params: {
        isActive: 'true',
        size: 500,
        role: NETWORK_COORDINATOR_ID,
    },
    multiParams: {
        sort: ['lastName,asc', 'firstName,asc'],
    },
});

export const createNewSocialNetworkUser = (userName: string) => crmRequest({
    url: URL_CREATE_SOC_NETWORK_USER,
    data: {
        id: 0,
        name: userName,
    },
});

export const createNewSocialNetwork = (networkName: string) => crmRequest({
    url: URL_CREATE_SOC_NETWORK,
    data: {
        name: networkName,
        type: 'SOCIAL_NETWORK',
    },
});
