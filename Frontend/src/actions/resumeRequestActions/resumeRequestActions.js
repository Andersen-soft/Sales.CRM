// @flow

import {
    getResume,
    changeResume,
    addResumeFile,
    deleteResumeFile,
    deleteResume as deleteResumeAPI,
    createResumeRequestResume as createResumeRequestResumeAPI,
} from 'crm-api/resumeRequestService/resumeRequestService';
import Notification from 'crm-components/notification/NotificationSingleton';
import type { Dispatch } from 'redux';
import {
    RESUME_REQUEST,
    RESUME_REQUEST_SUCCESS,
    GET_RESUME_REQUEST_ERROR,
    ADD_RESUME_REQUEST,
    ADD_RESUME_ERROR,
    NOTIFICATION_ERRORS,
    RESET_PAGE,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import { fetchResumeRequest } from 'crm-actions/resumeRequestActions/resumeRequestCardActions';

export type updateResumeArguments = {
    fio?: string,
    responsibleHrId?: number,
    status?: string,
}

export type createResumeArguments = {
    fullName: string,
    responsibleHrid: number,
    status: string,
    files: Array<File>,
}

export type getResumeArguments = {
    fio: string,
    status: string,
    responsibleHr: string,
    files: Array<string> | null,
}

export const fetchResume = (requestId: number, size?: number, page?: number) => (dispatch: Dispatch) => {
    dispatch({
        type: RESUME_REQUEST,
    });
    return getResume(requestId, size, page)
        .then(({ content, totalElements }) => {
            dispatch({
                type: RESUME_REQUEST_SUCCESS,
                payload: { content, totalElements },
            });
        })
        .catch(error => {
            dispatch({
                type: GET_RESUME_REQUEST_ERROR,
                payload: error,
            });
        });
};

export const updateResume = (
    requestId: number, params: updateResumeArguments, requestResumeId: number,
) => async (dispatch: Dispatch, getState: Function) => {
    dispatch({
        type: RESUME_REQUEST,
    });

    try {
        const response = await changeResume(requestId, params);
        const { resumes, totalElements } = getState().ResumeRequest.Resume;
        const payload = {
            content: resumes.map(resume => {
                if (resume.id !== response.id) {
                    return resume;
                }
                return response;
            }),
            totalElements,
        };

        dispatch({
            type: RESUME_REQUEST_SUCCESS,
            payload,
        });

        params.status && dispatch(fetchResumeRequest(requestResumeId));
    } catch (error) {
        dispatch({
            type: GET_RESUME_REQUEST_ERROR,
            payload: error,
        });

        Notification.showMessage({
            message: NOTIFICATION_ERRORS.UPDATE_FIELD_ERR,
            closeTimeout: 15000,
        });
    }
};

export const addAttachment = (
    resumeId: number, file: File,
) => async (dispatch: Dispatch, getState: Function) => {
    dispatch({
        type: RESUME_REQUEST,
    });

    try {
        const response = await addResumeFile(resumeId, file);
        const { resumes, totalElements } = getState().ResumeRequest.Resume;
        const payload = {
            content: resumes.map(resume => {
                if (resume.id !== resumeId) {
                    return resume;
                }

                return { ...resume, files: [response, ...resume.files] };
            }),
            totalElements,
        };

        dispatch({
            type: RESUME_REQUEST_SUCCESS,
            payload,
        });
    } catch (error) {
        dispatch({
            type: GET_RESUME_REQUEST_ERROR,
            payload: error,
        });

        Notification.showMessage({
            message: NOTIFICATION_ERRORS.ADD_ATTACHMENT_ERR,
            closeTimeout: 15000,
        });
    }
};

export const deleteAttachment = (
    resumeId: number, fileId: number,
) => async (dispatch: Dispatch, getState: Function) => {
    dispatch({
        type: RESUME_REQUEST,
    });

    try {
        await deleteResumeFile(resumeId, fileId);
        const { resumes, totalElements } = getState().ResumeRequest.Resume;
        const payload = {
            content: resumes.map(resume => {
                if (resume.id !== resumeId) {
                    return resume;
                }

                return { ...resume, files: resume.files.filter(({ id }) => id !== fileId) };
            }),
            totalElements,
        };

        dispatch({
            type: RESUME_REQUEST_SUCCESS,
            payload,
        });
    } catch (error) {
        dispatch({
            type: GET_RESUME_REQUEST_ERROR,
            payload: error,
        });

        Notification.showMessage({
            message: NOTIFICATION_ERRORS.DELETE_ATTACHMENT_ERR,
            closeTimeout: 15000,
        });
    }
};

export const deleteResume = (resumeId: number, requestId: number) => async (dispatch: Dispatch) => {
    dispatch({
        type: RESUME_REQUEST,
    });

    try {
        await deleteResumeAPI(resumeId);

        dispatch({
            type: RESET_PAGE,
        });
        dispatch(fetchResume(requestId));
    } catch (error) {
        dispatch({
            type: GET_RESUME_REQUEST_ERROR,
            payload: error,
        });

        Notification.showMessage({
            message: NOTIFICATION_ERRORS.DELETE_CANDIDATE_ERR,
            closeTimeout: 15000,
        });
    }
};

export const createResume = (
    requestId: number, params: createResumeArguments,
) => async (dispatch: Dispatch) => {
    dispatch({
        type: ADD_RESUME_REQUEST,
    });

    try {
        await createResumeRequestResumeAPI(requestId, params);

        dispatch({
            type: RESET_PAGE,
        });
        dispatch(fetchResume(requestId));
        dispatch(fetchResumeRequest(requestId));
    } catch (error) {
        dispatch({
            type: ADD_RESUME_ERROR,
            payload: error,
        });
        throw (error);
    }
};
