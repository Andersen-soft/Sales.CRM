// @flow

type Headers = {
    title: string,
    key: string,
}

export const tableColumns: Array<Headers> = [
    {
        title: 'File',
        key: 'file',
    },
    {
        title: 'User',
        key: 'user',
    },
    {
        title: 'Date of upload',
        key: 'changeDate',
    },
    {
        title: '',
        key: 'action',
    },
];

export const URL_DELETE_FILE = (id: number, fileId: number) => `/estimation_requests/${id}/estimations/${fileId}`;
export const URL_ADD_ESTMATION_FILE = (id: number) => `/estimation_requests/${id}/estimations`;

export const AVAILABLE_FILE_TYPES: string = '.jpg,.png,.gif,.txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.odt,.odts,.odg,.odp';

export const GET_ESTIMATIONS_REQUEST: string = 'GET_ESTIMATIONS_REQUEST';
export const GET_ESTIMATIONS_REQUEST_SUCCESS: string = 'GET_ESTIMATIONS_REQUEST_SUCCESS';
export const GET_ESTIMATIONS_REQUEST_ERROR: string = 'GET_ESTIMATIONS_REQUEST_ERROR';
