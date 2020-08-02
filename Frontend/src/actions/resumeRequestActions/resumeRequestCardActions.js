// @flow

import {
    getResumeRequest,
    updateResumeRequest,
    deleteResumeRequest,
} from 'crm-api/resumeRequestService/resumeRequestCardService';

import {
    GET_RESUME_REQUEST,
    UPDATE_OR_DELETE_REQUEST,
    GET_REQUEST,
    REQUEST_ERROR,
} from 'crm-constants/resumeRequestPage/resumeRequestCardConstants';

import Notification from 'crm-components/notification/NotificationSingleton';
import { CRMError } from 'crm-utils/errors';

import { pathOr } from 'ramda';

import type { Dispatch } from 'redux';

type ResumeRequest = {
    company: {
        id: number,
        name: string,
    },
    created: string,
    deadLine: string,
    employee: {
        firstName: string,
        id: number,
        lastName: string,
    },
    id: number,
    name: string,
    priority: string,
    responsible: {
        firstName: string,
        id: number,
        lastName: string,
    },
    saleId: number | null,
    status: string,
}

type ResumeResponse = {
    request: ResumeRequest,
}

export const fetchResumeRequest = (resumeId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_RESUME_REQUEST,
    });

    return getResumeRequest(resumeId)
        .then((response: ResumeResponse) => {
            dispatch({
                type: GET_REQUEST,
                payload: response,
            });

            return response;
        })
        .catch((error: Error) => {
            dispatch({
                type: REQUEST_ERROR,
                payload: error,
            });

            return error;
        });
};

export const updateResume = (resumeId: number, fieldName: string, updateData: string | number) => (
    dispatch: Dispatch
): boolean => {
    dispatch({
        type: GET_RESUME_REQUEST,
    });

    return updateResumeRequest(resumeId, fieldName, updateData)
        .then((response: ResumeResponse) => {
            dispatch({
                type: UPDATE_OR_DELETE_REQUEST,
                payload: response,
            });
            return true;
        })
        .catch((error: CRMError) => {
            dispatch({
                type: REQUEST_ERROR,
                payload: error,
            });

            Notification.showMessage({
                message: pathOr('Ошибка', ['response', 'data', 'errorMessage'], error),
                closeTimeout: 15000,
            });
            return false;
        });
};

export const deleteResume = (resumeId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_RESUME_REQUEST,
    });

    return deleteResumeRequest(resumeId)
        .then((response: ResumeResponse) => {
            dispatch({
                type: UPDATE_OR_DELETE_REQUEST,
                payload: response,
            });
        })
        .catch((err: CRMError) => {
            const { errorMessage } = err.response.data;

            Notification.showMessage({
                message: pathOr('Ошибка', err.response.data, errorMessage),
                closeTimeout: 15000,
            });
            throw err;
        });
};
