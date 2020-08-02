// @flow

import React from 'react';
import executeAction from 'crm-helpers/executeAction';
import crmRequest from 'crm-helpers/api/crmRequest';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    URL_LOGIN,
    URL_LOGOUT,
    SET_PATH_ON_LOGIN,
} from 'crm-constants/authConstants';
import { CRMError } from 'crm-utils/errors';

import Notification from 'crm-components/notification/NotificationSingleton';

import auth from 'crm-helpers/auth';

import type { CRMResponse } from 'crm-types/resourceDataTypes';
import type { Dispatch } from '../stores/Store.flow';

export type UserCredentials = {
    username: string,
    password: string,
};

export const login = (creds: UserCredentials) => (
    (dispatch: Dispatch): void => {
        executeAction(dispatch, LOGIN_REQUEST);
        return crmRequest({ url: URL_LOGIN, data: creds })
            .then((res: CRMResponse): CRMResponse => {
                executeAction(dispatch, LOGIN_SUCCESS, res);
                Notification.el && Notification.closeMessage();
                return res;
            })
            .catch((err: CRMError): CRMError => {
                executeAction(dispatch, LOGIN_FAILURE, err);
                Notification.showMessage({ message: err.response.data.errorMessage, closeTimeout: 15000 });
                return err;
            });
    }
);

export const logout = () => (
    (dispatch: Dispatch): void => {
        executeAction(dispatch, LOGOUT);
        // no need to handle server response, cause we have to drop the user
        // session in any case, even if there's connection error or
        // expired token
        crmRequest({ url: URL_LOGOUT, data: { token: auth.getRefreshToken() } });
    }
);

export const setPreviousPath = (path: string | null) => ({
    type: SET_PATH_ON_LOGIN,
    payload: path,
});
