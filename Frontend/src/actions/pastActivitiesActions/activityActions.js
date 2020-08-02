// @flow

import { addActivity as postActivity } from 'crm-api/desktopService/activityService';
import {
    PAST_ACTIVITIES_REQUEST,
    PAST_ACTIVITIES_ERROR,
    UPDATE_PAST_ACTIVITIES_SUCCESS,
} from 'crm-constants/pastActivities/pastActivitiesConstants';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { Dispatch } from 'redux';

export const addActivity = (
    requestBody: addActivityArguments,
) => (dispatch: Dispatch) => {
    dispatch({
        type: PAST_ACTIVITIES_REQUEST,
    });
    return postActivity(requestBody)
        .then(() => {
            dispatch({
                type: UPDATE_PAST_ACTIVITIES_SUCCESS,
            });
        })
        .catch((error: Object) => {
            dispatch({
                type: PAST_ACTIVITIES_ERROR,
                payload: error,
            });
        });
};
