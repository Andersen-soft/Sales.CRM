// @flow

import type { Dispatch, GetState } from 'redux';
import { equals } from 'ramda';

import { getUsers, getUsersWithFilters } from 'crm-api/adminUsersService';
import {
    ACTION,
    IS_ACTIVE_ALL,
    PAGE_SIZE,
} from 'crm-constants/adminUsers/adminUsers';
import { MAX_INT } from 'crm-constants/adminPage';
import { HEAD_SALE_ID, SALE_ID } from 'crm-roles';

export const resetAdminUsersStoreAction = () => (dispatch: Dispatch) => {
    dispatch({
        type: ACTION.RESET_USERS_STORE,
    });
};

const SORT_LAST_NAME_ASC = 'lastName,asc';

export const getSalesUsersAction = () => async (
    dispatch: Dispatch,
) => {
    try {
        dispatch({
            type: ACTION.GET_SALES_USER_LOADING,
        });

        const users = await getUsersWithFilters({
            size: MAX_INT,
            sortType: SORT_LAST_NAME_ASC,
            allFilters: {
                role: [HEAD_SALE_ID, SALE_ID],
            },
            isActive: true,
        });

        dispatch({
            type: ACTION.GET_SALES_USER_SUCCESS,
            payload: users.content ? users.content : [],
        });
    } catch (error) {
        dispatch({
            type: ACTION.GET_SALES_USER_ERROR,
            payload: error,
        });
    }
};

export const setUsersAction = (
    currentPage: number,
    sortType: string = 'id,desc',
) => async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const allFilters = state.AdminUsers.filters;

    dispatch({
        type: ACTION.GET_USERS_LOADING,
    });

    try {
        const users = await getUsers(currentPage, 50, sortType, allFilters);

        dispatch({
            type: ACTION.GET_USERS_SUCCESS,
            payload: users,
        });
    } catch (error) {
        dispatch({
            type: ACTION.GET_USERS_ERROR,
            payload: error,
        });
    }
};
export const setFiltersAction = (
    columnKey: string,
    filters: Object,
    sortType: string = 'id,desc',
) => async (dispatch: Dispatch, getState: GetState) => {
    let state = getState();

    const isActiveBoth = !!filters
        && (equals(filters, IS_ACTIVE_ALL) || !filters.length)
        && columnKey === 'isActive';

    isActiveBoth
        ? dispatch({
            type: ACTION.SET_FILTERS,
            payload: {
                ...state.AdminUsers.filters,
                [columnKey]: null,
            },
        })
        : dispatch({
            type: ACTION.SET_FILTERS,
            payload: {
                ...state.AdminUsers.filters,
                [columnKey]: filters,
            },
        });

    state = getState();
    const allFilters = state.AdminUsers.filters;

    dispatch({
        type: ACTION.GET_USERS_LOADING,
    });

    try {
        const users = await getUsersWithFilters({
            size: PAGE_SIZE,
            sortType,
            allFilters,
        });

        dispatch({
            type: ACTION.GET_USERS_SUCCESS,
            payload: users,
        });
    } catch (error) {
        dispatch({
            type: ACTION.GET_USERS_ERROR,
            payload: error,
        });
    }
};
