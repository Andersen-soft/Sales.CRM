// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';
import { PAGE_SIZE } from 'crm-constants/ResumePage/resumePageConstants';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import type { ResumeParameters, Filters, updateResumeArguments } from 'crm-types/resumePage';

const URL_GET_RESUMES = '/all_resume';
const URL_GET_RESUME_STATUSES = '/resume_request/get_statuses';
const URL_GET_RESPONSIBLE_HR = '/employee/get_employees';
const URL_DOWNLOAD_RESUME_REPORT = '/all_resume/reports/download';
const URL_UPDATE_RESUME = '/resume_request/resume/';

const fetchAllResumes = ({
    createDate,
    page,
    size = PAGE_SIZE,
    sort,
    responsibleHr,
    status,
    fio,
    resumeRequest,
    isUrgent,
}: ResumeParameters) => crmRequest({
    url: URL_GET_RESUMES,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        createDate,
        page,
        size,
        sort,
        responsibleHr,
        status,
        fio,
        isUrgent,
        'resumeRequest.name': resumeRequest,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const getResumeStatuses = () => crmRequest({
    url: URL_GET_RESUME_STATUSES,
    method: 'GET',
});

const getResponsibleHr = () => crmRequest({
    url: URL_GET_RESPONSIBLE_HR,
    method: 'GET',
    params: {
        role: 5,
        isActive: true,
    },
});

type DownloadArguments = {
    createDate: Array<string>,
} & Filters;

const downloadResumeReport = ({
    createDate,
    responsibleHr,
    status,
    fio,
    resumeRequest,
    isUrgent,
}: DownloadArguments) => crmRequest({
    url: URL_DOWNLOAD_RESUME_REPORT,
    responseType: 'blob',
    params: getObjectWithoutEmptyProperties({
        createDate,
        responsibleHr,
        status,
        fio,
        isUrgent,
        'resumeRequest.name': resumeRequest,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});


const changeResume = ({
    resumeId,
    responsibleHrId,
    comment,
    status,
    fio,
    isUrgent,
}: updateResumeArguments) => crmRequest({
    url: `${URL_UPDATE_RESUME}${resumeId}`,
    method: 'PUT',
    data: getObjectWithoutEmptyProperties({
        responsibleHrId,
        comment,
        status,
        fio,
        isUrgent,
    }),
});

export {
    fetchAllResumes,
    getResumeStatuses,
    getResponsibleHr,
    downloadResumeReport,
    changeResume,
};
