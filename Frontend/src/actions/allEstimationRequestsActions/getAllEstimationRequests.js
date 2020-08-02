// @flow

import type { Dispatch } from 'redux';

import {
    SET_PAGE,
    SET_ESTIMATION_REQUEST_FILTERS,
    SET_ESTIMATION_REQUEST_SORT,
    CLEAR_ESTIMATION_REQUESTS,
} from 'crm-constants/allEstimationRequests/estimationRequestsConstants';

import type { Filters } from 'crm-types/estimationRequests';

const setPage = (page: ?number) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_PAGE,
        payload: page,
    });
};

const setFilters = (filters: Filters) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_ESTIMATION_REQUEST_FILTERS,
        payload: filters,
    });
    dispatch(setPage(0));
};

const setSort = (sort: string) => (dispatch: Dispatch) => {
    dispatch({
        type: SET_ESTIMATION_REQUEST_SORT,
        payload: sort,
    });
};

const clearEstimationRequest = () => (dispatch: Dispatch) => {
    dispatch({
        type: CLEAR_ESTIMATION_REQUESTS,
    });
};

export {
    setPage,
    setFilters,
    setSort,
    clearEstimationRequest,
};
