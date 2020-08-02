// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { isNil } from 'ramda';

const REQUEST_URL_OLD: string = '/resume_request/old';
const REQUEST_URL: string = '/resume_request/';
const REQUEST_URL_STATUSES = `${REQUEST_URL}get_statuses`;

type ResumeRequest = {
    companyId: number,
    name: string,
    oldId?: string,
    id?: number
};

export const createResume = ({ companyId, name, oldId }: ResumeRequest) => crmRequest({
    url: REQUEST_URL_OLD,
    method: 'POST',
    data: { oldId, name, companyId },
});

export const updateResume = ({
    id, name, companyId, oldId,
}: ResumeRequest) => crmRequest({
    url: REQUEST_URL_OLD,
    method: 'PUT',
    data: {
        id,
        name,
        companyId,
        oldId,
    },
});

export const getStatuses = () => crmRequest({
    url: REQUEST_URL_STATUSES,
    method: 'GET',
});

export const createResumeRequestResume = (
    requestId: number | string,
    fullName: string,
    responsibleHrid: ?number | string,
    status: ?string,
    files: Array<File> = []
) => {
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
        url: `${REQUEST_URL}${requestId}/resume`,
        method: 'POST',
        data: formData,
    });
};
