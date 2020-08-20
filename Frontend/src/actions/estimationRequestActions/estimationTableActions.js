// @flow

import { getEstimationRequest } from 'crm-api/estimationRequestPageService/estimationCard';
import { addEstimationFile, deleteFile } from 'crm-api/estimationRequestPageService/estimationTable';
import { fetchHistory } from 'crm-actions/estimationRequestActions/historyActions';
import Notification from 'crm-components/notification/NotificationSingleton';
import type { Dispatch } from 'redux';
import {
    GET_ESTIMATIONS_REQUEST,
    GET_ESTIMATIONS_REQUEST_SUCCESS,
    GET_ESTIMATIONS_REQUEST_ERROR,
} from 'crm-constants/estimationRequestPage/estimationTable';

export const fetchEstimations = (id: number) => async (dispatch: Dispatch) => {
    dispatch({
        type: GET_ESTIMATIONS_REQUEST,
    });

    try {
        const { estimations } = await getEstimationRequest(id);

        dispatch({
            type: GET_ESTIMATIONS_REQUEST_SUCCESS,
            payload: estimations.reverse(),
        });
    } catch (error) {
        dispatch({
            type: GET_ESTIMATIONS_REQUEST_ERROR,
            payload: error,
        });
    }
};

export const addEstimation = (id: number, file: File) => async (dispatch: Dispatch) => {
    dispatch({
        type: GET_ESTIMATIONS_REQUEST,
    });

    try {
        await addEstimationFile(id, file);
    } catch (error) {
        Notification.showMessage({
            message: 'Общий размер файлов превышает установленное ограничение',
            closeTimeout: 15000,
        });
        dispatch({
            type: GET_ESTIMATIONS_REQUEST_ERROR,
            payload: error,
        });
    } finally {
        dispatch(fetchEstimations(id));
        dispatch(fetchHistory(id));
    }
};

export const deleteEstimation = (id: number, fileId: number) => async (dispatch: Dispatch) => {
    dispatch({
        type: GET_ESTIMATIONS_REQUEST,
    });

    try {
        await deleteFile(id, fileId);

        dispatch(fetchEstimations(id));
        dispatch(fetchHistory(id));
    } catch (error) {
        Notification.showMessage({
            message: 'Ошибка при удалении файла',
            closeTimeout: 15000,
        });
        dispatch({
            type: GET_ESTIMATIONS_REQUEST_ERROR,
            payload: error,
        });
    }
};
