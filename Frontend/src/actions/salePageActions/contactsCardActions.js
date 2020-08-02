// @flow

import {
    getContacts,
    updateContacts,
    deleteContacts,
    createContacts,
} from 'crm-api/contactsCard/contactsCardService';
import { fetchSale } from 'crm-actions/salePageActions/salePageActions';

import {
    GET_CONTACTS_REQUEST,
    GET_CONTACTS,
    ACTION_CONTACTS,
    CONTACTS_ERROR,
} from 'crm-constants/salePage/contactsCardConstants';

import type { Contact } from 'crm-types/resourceDataTypes';
import type { Dispatch } from 'redux';

type updateContactData = {
    country: string,
    email: string,
    firstName: string,
    isActive: boolean,
    lastName: string,
    personalEmail: string,
    phone: string,
    position: string,
    skype: string,
    socialContact: string,
    socialNetwork: string,
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id?: number;
    responsibleName?: string;
    types: Array<string>;
    dateOfBirth: ?string,
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

type ResponseContacts = {
    content: Array<Contact>,
}

export const fetchContacts = (companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_CONTACTS_REQUEST,
    });

    return getContacts(companyId)
        .then((response: ResponseContacts) => {
            dispatch({
                type: GET_CONTACTS,
                payload: response.content,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: CONTACTS_ERROR,
                payload: error,
            });
        });
};

export const updateOneContact = (
    contactId: number,
    updateContactResponse: updateContactData,
    companyId: number
) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_CONTACTS_REQUEST,
    });

    return updateContacts(contactId, updateContactResponse)
        .then(() => {
            dispatch({
                type: ACTION_CONTACTS,
            });
            dispatch(fetchContacts(companyId));
        })
        .catch((error: Error) => {
            dispatch({
                type: CONTACTS_ERROR,
                payload: error,
            });
        });
};

export const deleteOneContact = (contactId: number, companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_CONTACTS_REQUEST,
    });

    return deleteContacts(contactId)
        .then(() => {
            dispatch({
                type: ACTION_CONTACTS,
            });
            dispatch(fetchContacts(companyId));
        })
        .catch((error: Error) => {
            dispatch({
                type: CONTACTS_ERROR,
                payload: error,
            });
        });
};

export const createOneContact = (newContact: newContactTypes) => (dispatch: Dispatch, getState: Function) => {
    dispatch({
        type: GET_CONTACTS_REQUEST,
    });

    const { SaleCard: { sale: { id: saleId } } } = getState();

    return createContacts(newContact)
        .then(() => {
            dispatch({
                type: ACTION_CONTACTS,
            });
            dispatch(fetchContacts(newContact.companyId));
            dispatch(fetchSale(saleId));
        })
        .catch((error: Error) => {
            dispatch({
                type: CONTACTS_ERROR,
                payload: error,
            });
        });
};
