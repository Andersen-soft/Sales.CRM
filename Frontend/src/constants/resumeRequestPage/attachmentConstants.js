// @flow

export const URL_GET_ATTACHMENTS = (id: number) => `/resume_request/${id}/attachment`;
export const URL_ADD_ATTACHMENT = (id: number) => `/resume_request/${id}/attachment`;
export const URL_DELETE_ATTACHMENT = (id: number, fileId: number) => `/resume_request/${id}/attachment/${fileId}`;

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
}

export const MAX_FILE_SIZE = 20000000;
