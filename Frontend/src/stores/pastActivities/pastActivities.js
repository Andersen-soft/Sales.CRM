// @flow

import {
    PAST_ACTIVITIES_REQUEST,
    PAST_ACTIVITIES_ERROR,
    GET_PAST_ACTIVITIES_SUCCESS_FIRST_REQUEST,
    GET_PAST_ACTIVITIES_SUCCESS,
    GET_PAST_ACTIVITIES_CONTACTS_SUCCESS,
    UPDATE_PAST_ACTIVITIES_SUCCESS,
    GET_PAST_ACTIVITIES_COUNT_SUCCESS,
} from 'crm-constants/pastActivities/pastActivitiesConstants';
import type { Sale, Contact } from 'crm-types/resourceDataTypes';
import { sortBy } from 'ramda';
import type { Action } from '../Store.flow';

const initialState = {
    pastActivitiesSales: {
        content: [],
        totalElements: 0,
    },
    contacts: [],
    isLoading: false,
    error: null,
    pastActivitiesCount: 0,
};

export type PastActivitiesState = {
    pastActivitiesSales: {
        content: Array<Sale>,
        totalElements: number,
    },
    contacts: Array<Contact>,
    isLoading: boolean,
    pastActivitiesCount: number,
}

const pastActivitiesReducer = (state: PastActivitiesState = initialState, { payload, type }: Action) => {
    switch (type) {
        case PAST_ACTIVITIES_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_PAST_ACTIVITIES_SUCCESS_FIRST_REQUEST:
        case GET_PAST_ACTIVITIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                pastActivitiesSales: payload,
                error: null,
            };
        case GET_PAST_ACTIVITIES_CONTACTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                contacts: payload,
                error: null,
            };
        case UPDATE_PAST_ACTIVITIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case GET_PAST_ACTIVITIES_COUNT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                pastActivitiesCount: payload,
            };
        case PAST_ACTIVITIES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: payload,
            };
        default:
            return state;
    }
};

export const getSortedPastActivities = (state: Array<Sale>) => sortBy(
    ({ nextActivityDate }) => new Date(nextActivityDate), state
).reverse();

export default pastActivitiesReducer;
