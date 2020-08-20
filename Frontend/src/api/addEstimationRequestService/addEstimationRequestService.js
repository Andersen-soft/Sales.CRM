// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { URL_ADD_ESTIMATION_REQUEST } from 'crm-constants/addEstimationRequest/addEstimationRequestConstants';

type RequestParams = {
    companyId: number,
    name: string,
    deadline: string,
    comment: ?string,
    selectedFiles: Array<File>,
    companySale: number,
}

export const addEstimationRequest = ({
    companyId,
    name,
    deadline,
    comment,
    selectedFiles,
    companySale,
}: RequestParams) => {
    const formData = new FormData();

    formData.append('json', new Blob([JSON.stringify({
        companyId,
        name,
        deadline,
        comment,
        companySale,
    })], {
        type: 'application/json',
    }));

    selectedFiles.forEach(file => {
        formData.append('files', file, file.name);
    });

    return crmRequest({
        url: URL_ADD_ESTIMATION_REQUEST,
        headers: { 'content-type': 'multipart/form-data;' },
        data: formData,
    });
};
