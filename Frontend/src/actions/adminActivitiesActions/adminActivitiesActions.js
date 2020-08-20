// @flow

import type { Dispatch, GetState } from 'redux';

import { getUsersActivities } from 'crm-api/adminActivitiesService';
import { ACTION } from 'crm-constants/adminActivities/adminActivities';
import { toFullIsoFormat } from 'crm-utils/dates';

const getActivitiesAction = async (dispatch: Dispatch, getState: GetState, currentPage?: number) => {
    const state = getState().AdminActivities;
    const page = currentPage || 0;
    const { responsible } = state;
    const { searchValue } = state.filters;
    const { dateRange } = state.filters;
    const dateActivity = [toFullIsoFormat(dateRange.from), toFullIsoFormat(dateRange.to)];

    dispatch({ type: ACTION.ACTIVITIES_LOADING });
    try {
        const activities = await getUsersActivities(responsible, searchValue, dateActivity, page);

        dispatch({ type: ACTION.ACTIVITIES_SUCCESS, payload: activities });
    } catch (error) {
        dispatch({ type: ACTION.ACTIVITIES_ERROR });
    }
};

const setUserIdAction = (userId: number) => (dispatch: Dispatch, getState: GetState) => {
    dispatch({ type: ACTION.ACTIVITIES_RESPONSIBLE, payload: userId });
    getActivitiesAction(dispatch, getState);
};

const setPageAction = (page: number) => (dispatch: Dispatch, getState: GetState) => {
    getActivitiesAction(dispatch, getState, page);
};


const resetAdminActivitiesStoreAction = () => (dispatch: Dispatch) => {
    dispatch({
        type: ACTION.RESET_ACTIVITIES,
    });
};

const setDateRangeAction = (dateRange: Object) => (dispatch: Dispatch, getState: GetState) => {
    dispatch({
        type: ACTION.SET_ACTIVITIES_DATE,
        payload: dateRange,
    });
    getActivitiesAction(dispatch, getState);
};

const setSearchAction = (searchValue: string) => (dispatch: Dispatch) => {
    dispatch({
        type: ACTION.SET_ACTIVITIES_SEARCH,
        payload: searchValue,
    });
};

const getActivitiesSearchAction = () => (dispatch: Dispatch, getState: GetState) => {
    getActivitiesAction(dispatch, getState);
};

export {
    getActivitiesAction, resetAdminActivitiesStoreAction, setDateRangeAction,
    setSearchAction, setUserIdAction, setPageAction, getActivitiesSearchAction,
};
