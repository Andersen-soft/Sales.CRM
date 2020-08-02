// @flow

import {
    GET_CONTACTS_REQUEST,
    GET_CONTACTS,
    ACTION_CONTACTS,
    CONTACTS_ERROR,
    CLEAR_CONTACTS_CARD,
} from 'crm-constants/salePage/contactsCardConstants';

import type { Action } from '../Store.flow';

const initialState = {
    contacts: [],
    isLoading: false,
    error: null,
};

type ContactsType = {
    country: string,
    email: string,
    firstName: string,
    id: number,
    isActive: boolean,
    lastName: string,
    personalEmail: string,
    phone: string,
    position: string,
    skype: string,
    socialContact: string,
    socialNetwork: string,
    sourceId: number,
};


export type ContactState = {
    contacts: Array<ContactsType>,
    isLoading: boolean;
};

const contactsList = (state: ContactState = initialState, action: Action) => {
    const {
        type,
        payload,
    } = action;

    switch (type) {
        case GET_CONTACTS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_CONTACTS:
            return {
                ...state,
                isLoading: false,
                contacts: payload,
            };
        case ACTION_CONTACTS:
            return {
                ...state,
                isLoading: false,
            };
        case CONTACTS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: payload,
            };
        case CLEAR_CONTACTS_CARD:
            return initialState;
        default:
            return state;
    }
};

export default contactsList;
