// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import {
    URL_GET_STATUSES,
    URL_GET_RESUME,
    URL_GET_USERS_REQUEST,
    URL_ADD_RESUME_REQUEST,
    URI_COMMENTS,
    COMMENTS_REQUEST_SIZE,
    URL_UPDATE_RESUME,
    URL_ADD_RESUME_ATTACHMENT,
    URL_DELETE_RESUME_ATTACHMENT,
    URL_DELETE_RESUME,
    URL_ADD_RESUME,
    RESUME_TABLE_ROW_PER_PAGE,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import {
    URL_GET_ATTACHMENTS,
    URL_ADD_ATTACHMENT,
    URL_DELETE_ATTACHMENT,
} from 'crm-constants/resumeRequestPage/attachmentConstants';
import { isNil } from 'ramda';
import type { updateResumeArguments, createResumeArguments } from 'crm-actions/resumeRequestActions/resumeRequestActions';

export const getStatuses = () => crmRequest({
    url: URL_GET_STATUSES,
    method: 'GET',
});

export const getResume = (requestId: number, size?: number, page?: number) => (
    crmRequest({
        url: URL_GET_RESUME,
        method: 'GET',
        params: {
            resumeRequest: requestId,
            size: size || RESUME_TABLE_ROW_PER_PAGE,
            page,
            sort: 'createDate,desc',
            isActive: true,
        },
    })
);

export const changeResume = (id: number, params: updateResumeArguments) => (
    crmRequest({
        url: `${URL_UPDATE_RESUME}${id}`,
        method: 'PUT',
        data: params,
    })
);

export const addResumeFile = (id: number, file: File) => {
    const formData = new FormData();

    formData.append('file', file, file.name);

    return crmRequest({
        url: URL_ADD_RESUME_ATTACHMENT(id),
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data;' },
        data: formData,
    });
};

export const deleteResumeFile = (resumeId: number, fileId: number) => crmRequest({
    url: URL_DELETE_RESUME_ATTACHMENT(resumeId, fileId),
    method: 'DELETE',
});

export const deleteResume = (resumeId: number) => crmRequest({
    url: `${URL_DELETE_RESUME}${resumeId}`,
    method: 'DELETE',
});

export const fetchUsersByRole = (role: number, size: number = 1000) => (
    crmRequest({
        url: URL_GET_USERS_REQUEST,
        method: 'GET',
        params: {
            isActive: true,
            role,
            size,
        },
    })
);

export const getComments = (resumeId: number) => crmRequest({
    url: `${URL_ADD_RESUME_REQUEST}/${resumeId}${URI_COMMENTS}`,
    method: 'GET',
    params: {
        id: resumeId,
        page: 0,
        size: COMMENTS_REQUEST_SIZE,
        sort: 'createDate,asc',
    },
});

export const addComment = (resumeId: number, description: string) => crmRequest({
    url: `${URL_ADD_RESUME_REQUEST}/${resumeId}${URI_COMMENTS}`,
    method: 'POST',
    data: {
        description,
        id: resumeId,
    },
});

export const deleteComment = (resumeRequestId: number, commentId: number) => crmRequest({
    url: `${URL_ADD_RESUME_REQUEST}/${resumeRequestId}${URI_COMMENTS}/${commentId}`,
    method: 'DELETE',
});

export const editComment = (resumeRequestId: number, commentId: number, description: string) => crmRequest({
    url: `${URL_ADD_RESUME_REQUEST}/${resumeRequestId}${URI_COMMENTS}/${commentId}`,
    method: 'PUT',
    data: {
        description,
        commentId,
        id: resumeRequestId,
    },
});

export const getAttachments = (resumeRequestId: number) => (crmRequest({
    url: URL_GET_ATTACHMENTS(resumeRequestId),
    method: 'GET',
    params: {
        size: 500,
        sort: 'creationDate,desc',
    },
}).then(response => response.content));

export const addAttachment = (resumeRequestId: number, files: Array<File>) => {
    const formData = new FormData();

    files.forEach(file => formData.append('file', file, file.name));
    return crmRequest({
        url: URL_ADD_ATTACHMENT(resumeRequestId),
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data;' },
        data: formData,
    });
};

export const deleteAttachment = (resumeRequestId: number, fileId: number) => (crmRequest({
    url: URL_DELETE_ATTACHMENT(resumeRequestId, fileId),
    method: 'DELETE',
}));

export const createResumeRequestResume = (requestId: number, params: createResumeArguments) => {
    const {
        fullName, responsibleHrid, status, files,
    } = params;
    const formData = new FormData();
    const resumeDto = {};

    resumeDto.fio = fullName;
    if (!isNil(responsibleHrid)) {
        resumeDto.responsibleHrId = responsibleHrid;
    }
    if (!isNil(status)) {
        resumeDto.status = status;
    }

    files.forEach(file => formData.append('files', file, file.name));

    const blob = new Blob([JSON.stringify(resumeDto)], { type: 'application/json' });

    formData.append('resumeDto', blob, 'json.json');

    return crmRequest({
        url: URL_ADD_RESUME(requestId),
        method: 'POST',
        data: formData,
    });
};
