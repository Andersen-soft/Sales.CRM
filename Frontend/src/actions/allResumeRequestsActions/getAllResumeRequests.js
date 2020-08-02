// @flow

import type { Dispatch } from 'redux';

import {
    SET_PAGE,
    SET_RESUME_REQUEST_FILTERS,
    SET_RESUME_REQUEST_SORT,
    CLEAR_RESUME_REQUESTS,
} from 'crm-constants/allResumeRequests/resumeRequestsConstants';
import { type fetchResumeRequestsArguments } from 'crm-api/allResumeRequestsService/allResumeRequestsService';


const setPage = (page: ?number) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_PAGE,
        payload: page,
    });
};

const setFilters = (filters: fetchResumeRequestsArguments) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_RESUME_REQUEST_FILTERS,
        payload: filters,
    });
    dispatch(setPage(0));
};

const setSort = (sort: string) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_RESUME_REQUEST_SORT,
        payload: sort,
    });
};

const clearResumeRequest = () => (dispatch: Dispatch) => {
    dispatch({
        type: CLEAR_RESUME_REQUESTS,
    });
};

export {
    setPage,
    setFilters,
    setSort,
    clearResumeRequest,
};
