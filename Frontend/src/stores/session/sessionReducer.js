// @flow

import auth from 'crm-helpers/auth';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    SET_PATH_ON_LOGIN,
    LOGOUT,
} from 'crm-constants/authConstants';

import type { Action } from '../Store.flow';
import type { SessionStore } from './SessionStore.flow';

const initialState: SessionStore = {
    userData: auth.getUserData() || null,
    loading: false,
    err: null,
    prevPath: null,
};

export default function sessionReducer(
    state: SessionStore = initialState,
    { type, payload }: Action,
) {
    switch (type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case LOGIN_SUCCESS:
            return {
                userData: payload,
                loading: false,
                err: null,
            };
        case LOGIN_FAILURE:
            return {
                userData: null,
                loading: false,
                err: payload,
            };
        case SET_PATH_ON_LOGIN:
            return {
                ...state,
                prevPath: payload,
            };
        case LOGOUT:
            return {
                ...state,
                userData: null,
                loading: false,
                err: null,
                prevPath: null,
            };
        default:
            return state;
    }
}
