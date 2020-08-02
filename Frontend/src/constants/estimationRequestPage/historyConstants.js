// @flow

export const GET_HISTORY_REQUEST: string = 'GET_HISTORY_REQUEST';
export const GET_FIRST_HISTORY_REQUEST: string = 'GET_FIRST_HISTORY_REQUEST';
export const GET_HISTORY_SUCCESS: string = 'GET_HISTORY_SUCCESS';
export const GET_HISTORY_ERROR: string = 'GET_HISTORY_ERROR';

export const URL_GET_ESTIMATION_HISTORY = '/history/estimation_request';

type tableColumnKeys = {
    DESCRIPTION: string;
    EMPLOYEE: string;
    CHANGE_DATE: string;
}

export const TABLE_COLUMN_KEYS: tableColumnKeys = {
    DESCRIPTION: 'description',
    EMPLOYEE: 'employee',
    CHANGE_DATE: 'date',
};

export const HISTORY_ROW_PER_PAGE: number = 10;
