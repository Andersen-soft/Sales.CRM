// @flow

export const URL_GET_ATTACHMENTS = (id: number) => `/estimation_requests/${id}/attachments`;
export const URL_ADD_ATTACHMENTS = (id: number) => `/estimation_requests/${id}/attachments`;
export const URL_DELETE_ATTACHMENTS = (id: number, fileId: number) => `/estimation_requests/${id}/attachments/${fileId}`;

type tableColumnKeys = {
    FILE: string,
    USER: string,
    ADD_DATE: string,
    ACTIONS: string,
}

export const TABLE_COLUMN_KEYS: tableColumnKeys = {
    FILE: 'file',
    USER: 'user',
    ADD_DATE: 'addDate',
    ACTIONS: 'actions',
};

export type Headers = {
    title: string,
    key: string,
};

export const MAX_FILE_SIZE = 20000000;
