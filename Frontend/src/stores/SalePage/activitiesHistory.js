// @flow

import {
    GET_ACTIVITIES_REQUEST,
    GET_ACTIVITIES,
    GET_ACTIVITIES_TYPES,
    UPDATE_OR_DELETE_ACTIVITIES,
    ACTIVITIES_ERROR,
    CLEAR_ACTIVITIES_HISTORY,
} from 'crm-constants/salePage/activitiesHistoryConstant';

import type { Action } from '../Store.flow';

const initialState = {
    activities: [],
    typesActivity: [],
    isLoading: false,
    error: null,
};

type SingleActivity = {
    contacts: string;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    types: string;
}

export type ActivitiesHistoryState = {
    activities: Array<SingleActivity>,
    typesActivity: Array<String>,
    isLoading: boolean,
}

const activitiesHistoryReducer = (state: ActivitiesHistoryState = initialState, action: Action) => {
    switch (action.type) {
        case GET_ACTIVITIES_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_ACTIVITIES:
            return {
                ...state,
                isLoading: false,
                activities: action.payload.content,
                activitiesCount: action.payload.totalElements,
            };
        case GET_ACTIVITIES_TYPES:
            return {
                ...state,
                isLoading: false,
                typesActivity: action.payload,
            };
        case UPDATE_OR_DELETE_ACTIVITIES:
            return {
                ...state,
                isLoading: false,
            };
        case ACTIVITIES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case CLEAR_ACTIVITIES_HISTORY:
            return initialState;
        default:
            return state;
    }
};

export default activitiesHistoryReducer;
