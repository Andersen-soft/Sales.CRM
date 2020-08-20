// @flow

import type { Action } from 'redux';

import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { ACTION } from 'crm-constants/adminActivities/adminActivities';

type State = {
    activities: {},
    isLoading: boolean,
    error: null | string,
    filters: Object
}

const initialState = {
    activities: {},
    isLoading: false,
    error: null,
    responsible: null,
    filters: {
        searchValue: '',
        dateRange: {
            from: getDate(new Date(), FULL_DATE_DS),
            to: getDate(new Date(), FULL_DATE_DS),
        },
    },
};

const AdminActivities = (state: State = initialState, { type, payload }: Action) => {
    switch (type) {
        case (ACTION.ACTIVITIES_LOADING): {
            return ({
                ...state,
                isLoading: true,
            });
        }
        case (ACTION.ACTIVITIES_SUCCESS): {
            return ({
                ...state,
                isLoading: false,
                activities: payload,
            });
        }
        case (ACTION.ACTIVITIES_ERROR): {
            return ({
                ...state,
                error: payload,
                isLoading: false,
            });
        }
        case (ACTION.RESET_ACTIVITIES): {
            return ({
                ...initialState,
            });
        }
        case (ACTION.ACTIVITIES_RESPONSIBLE): {
            return ({
                ...state,
                responsible: payload,
            });
        }

        case (ACTION.SET_ACTIVITIES_DATE): {
            return ({
                ...state,
                filters: {
                    ...state.filters,
                    dateRange: payload,
                },
            });
        }
        case (ACTION.SET_ACTIVITIES_SEARCH): {
            return ({
                ...state,
                filters: {
                    ...state.filters,
                    searchValue: payload,
                },
            });
        }
        default: return state;
    }
};

export default AdminActivities;

