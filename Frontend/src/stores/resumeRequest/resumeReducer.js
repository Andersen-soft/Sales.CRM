// @flow

import {
    RESUME_REQUEST,
    RESUME_REQUEST_SUCCESS,
    GET_RESUME_REQUEST_ERROR,
    RESET_PAGE,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { Resume } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { Action } from '../Store.flow';

export type ResumeState = {
    resumes: Array<Resume>,
    totalElements: number | null,
    isLoading: boolean,
    page: number,
    error: string | null,
    resetPage: boolean,
}

const initialState:ResumeState = {
    resumes: [],
    page: 0,
    isLoading: false,
    error: null,
    totalElements: null,
    resetPage: false,
};

const resumeReducer = (state: ResumeState = initialState, { type, payload }: Action):ResumeState => {
    switch (type) {
        case RESUME_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case RESUME_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                resumes: payload.content,
                totalElements: payload.totalElements,
                resetPage: false,
            };
        case GET_RESUME_REQUEST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: payload,
            };
        case RESET_PAGE:
            return {
                ...state,
                resetPage: true,
            };
        default:
            return state;
    }
};

export default resumeReducer;
