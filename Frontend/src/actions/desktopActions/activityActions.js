// @flow

import { addActivity as postActivity } from 'crm-api/desktopService/activityService';
import {
    SALES_REQUEST,
    SALES_ERROR,
    UPDATE_SALE_SUCCESS,
} from 'crm-constants/desktop/salesConstants';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { Dispatch } from 'redux';

export const addActivity = (
    requestBody: addActivityArguments,
) => (dispatch: Dispatch) => {
    dispatch({
        type: SALES_REQUEST,
    });
    return postActivity(requestBody)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_SUCCESS,
            });
        })
        .catch((error: Object) => {
            dispatch({
                type: SALES_ERROR,
                payload: error,
            });
        });
};
