// @flow

import type { Action } from 'redux';

import { ACTION } from 'crm-constants/adminUsers/adminUsers';

type State = {
    users: {},
    sales: [],
    isSalesLoading: boolean,
    isLoading: boolean,
    error: null | string
}

const initialState = {
    users: {},
    sales: [],
    isSalesLoading: false,
    isLoading: false,
    error: null,
    filters: {
        name: null,
        email: null,
        login: null,
        role: null,
        skype: null,
        position: null,
        isActive: null,
    },
};

const AdminUsers = (state: State = initialState, { type, payload }: Action) => {
    switch (type) {
        case ACTION.GET_USERS_LOADING: {
            return (
                {
                    ...state,
                    isLoading: true,
                }
            );
        }
        case ACTION.GET_SALES_USER_LOADING: {
            return (
                {
                    ...state,
                    isSalesLoading: true,
                }
            );
        }
        case ACTION.GET_USERS_SUCCESS: {
            return (
                {
                    ...state,
                    users: { ...payload },
                    isLoading: false,
                }
            );
        }
        case ACTION.GET_SALES_USER_SUCCESS: {
            return ({
                ...state,
                sales: payload,
                isSalesLoading: false,
            });
        }
        case ACTION.GET_USERS_ERROR: {
            return (
                {
                    ...state,
                    error: payload,
                    isSalesLoading: false,
                }
            );
        }
        case ACTION.GET_SALES_USER_ERROR: {
            return (
                {
                    ...state,
                    error: payload,
                    isLoading: false,
                }
            );
        }
        case ACTION.SET_FILTERS: {
            return ({
                ...state,
                filters: payload,
            });
        }
        case ACTION.RESET_USERS_STORE: {
            return ({
                ...initialState,
                sales: state.sales,
                isSalesLoading: state.isSalesLoading,
            });
        }
        default: return state;
    }
};

export default AdminUsers;

