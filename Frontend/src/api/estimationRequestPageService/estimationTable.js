// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import {
    URL_DELETE_FILE,
    URL_ADD_ESTMATION_FILE,
} from 'crm-constants/estimationRequestPage/estimationTable';

export const deleteFile = (estimationId: number, fileId: number) => crmRequest({
    url: URL_DELETE_FILE(estimationId, fileId),
    method: 'DELETE',
});

export const addEstimationFile = (estimationId: number, file: File) => {
    const formData = new FormData();

    formData.append('file', file, file.name);
    return crmRequest({
        url: URL_ADD_ESTMATION_FILE(estimationId),
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data;' },
        data: formData,
    });
};
