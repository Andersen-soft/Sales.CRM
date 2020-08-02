// @flow

import type { Action } from 'redux';

import {
    CLEAR_RESUME_REQUESTS,
    SET_PAGE,
    SET_RESUME_REQUEST_FILTERS,
    SET_RESUME_REQUEST_SORT,
    TABLE_COLUMN_KEYS,
} from 'crm-constants/allResumeRequests/resumeRequestsConstants';
import type { Filters } from 'crm-types/allResumeRequests';

export type ResumeRequestState = {
    page: number,
    filters: Filters,
    sort: string,
};

const initialState: ResumeRequestState = {
    page: 0,
    filters: {
        'status': null,
        'companyId': null,
        'responsibleForSaleRequestId': null,
        'responsibleId': null,
        'name': null,
        'resumes.responsibleHr.id': [],
        'resumes.status': [],
    },
    sort: `${TABLE_COLUMN_KEYS.CREATION_DATE},desc`,
};

export const allResumeRequestsReducer = (
    state: ResumeRequestState = initialState,
    { payload, type }: Action,
): ResumeRequestState => {
    switch (type) {
        case SET_PAGE: {
            return {
                ...state,
                page: payload,
            };
        }
        case CLEAR_RESUME_REQUESTS: {
            return initialState;
        }
        case SET_RESUME_REQUEST_FILTERS: {
            return {
                ...state,
                filters: payload,
            };
        }
        case SET_RESUME_REQUEST_SORT: {
            return {
                ...state,
                sort: payload,
            };
        }
        default:
            return state;
    }
};

export default allResumeRequestsReducer;
