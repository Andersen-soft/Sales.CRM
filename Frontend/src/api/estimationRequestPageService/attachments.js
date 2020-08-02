// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import {
    URL_GET_ATTACHMENTS,
    URL_ADD_ATTACHMENTS,
    URL_DELETE_ATTACHMENTS,
} from 'crm-constants/estimationRequestPage/attachmentConstants';

export const getAttachments = (estimateRequestId: number) => crmRequest({
    url: URL_GET_ATTACHMENTS(estimateRequestId),
    method: 'GET',
    params: {
        size: 500,
        sort: 'creationDate,desc',
    },
});

export const addAttachments = (estimateRequestId: number, files: Array<File>) => {
    const formData = new FormData();

    files.forEach(file => formData.append('file', file, file.name));
    return crmRequest({
        url: URL_ADD_ATTACHMENTS(estimateRequestId),
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data' },
        data: formData,
    });
};

export const deleteAttachments = (estimateRequestId: number, fieldId: number) => crmRequest({
    url: URL_DELETE_ATTACHMENTS(estimateRequestId, fieldId),
    method: 'DELETE',
});
