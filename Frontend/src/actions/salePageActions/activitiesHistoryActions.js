// @flow

import {
    getActivitiesHistory,
    getTypes,
    updateActivity,
    deleteActivity,
    getSearchActivity,
} from 'crm-api/activityHistory/activityHistoryService';
import {
    GET_ACTIVITIES_REQUEST,
    GET_ACTIVITIES,
    GET_ACTIVITIES_TYPES,
    UPDATE_OR_DELETE_ACTIVITIES,
    ACTIVITIES_ERROR,
    ROWS_PER_PAGE,
} from 'crm-constants/salePage/activitiesHistoryConstant';
import type { SingleActivity } from 'crm-types/resourceDataTypes';
import trimValue from 'crm-utils/trimValue';
import type { Dispatch } from 'redux';

type updateActivityData = {
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id?: number;
    responsibleName?: string;
    types: Array<string>;
}

export const fetchActivities = (
    saleId: number,
    size: number = ROWS_PER_PAGE,
    page: number = 0,
) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_ACTIVITIES_REQUEST,
    });

    return getActivitiesHistory(saleId, size, page)
        .then((response: Array<SingleActivity>) => {
            dispatch({
                type: GET_ACTIVITIES,
                payload: response,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: ACTIVITIES_ERROR,
                payload: error,
            });
        });
};

export const fetchActivitiesTypes = () => (dispatch: Dispatch) => {
    dispatch({
        type: GET_ACTIVITIES_REQUEST,
    });

    return getTypes()
        .then((response: Array<String>) => {
            dispatch({
                type: GET_ACTIVITIES_TYPES,
                payload: response,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: ACTIVITIES_ERROR,
                payload: error,
            });
        });
};

export const updateActivityTable = (
    activityId: number,
    data: updateActivityData,
    saleId: number,
    size: number,
    page: number
) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_ACTIVITIES_REQUEST,
    });

    return updateActivity(activityId, data)
        .then(() => {
            dispatch({
                type: UPDATE_OR_DELETE_ACTIVITIES,
            });
            dispatch(fetchActivities(saleId, size, page));
        })
        .catch((error: Error) => {
            dispatch({
                type: ACTIVITIES_ERROR,
                payload: error,
            });
        });
};

export const deleteOneActivity = (
    activityId: number,
    saleId: number,
    size: number,
    page: number
) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_ACTIVITIES_REQUEST,
    });

    return deleteActivity(activityId)
        .then(() => {
            dispatch({
                type: UPDATE_OR_DELETE_ACTIVITIES,
            });
            dispatch(fetchActivities(saleId, size, page));
        })
        .catch((error: Error) => {
            dispatch({
                type: ACTIVITIES_ERROR,
                payload: error,
            });
        });
};

export const fetchSearchActivity = (searchData: string, saleId: number, size: number, canceled?: boolean) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_ACTIVITIES_REQUEST,
    });

    return getSearchActivity(trimValue(searchData), saleId, size, canceled)
        .then((response: Array<String>) => {
            dispatch({
                type: GET_ACTIVITIES,
                payload: response,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: ACTIVITIES_ERROR,
                payload: error,
            });
        });
};
