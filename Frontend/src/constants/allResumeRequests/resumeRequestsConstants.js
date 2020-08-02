// @flow

// actions
export const CLEAR_RESUME_REQUESTS = 'CLEAR_RESUME_REQUESTS';
export const SET_PAGE = 'SET_PAGE';
export const SET_RESUME_REQUEST_FILTERS = 'SET_RESUME_REQUEST_FILTERS';
export const SET_RESUME_REQUEST_SORT = 'SET_RESUME_REQUEST_SORT';

export const TABLE_COLUMN_KEYS = {
    NAME: 'resumeInfo',
    COMPANY: 'companyName',
    STATUS: 'status',
    RETURNS_RESUME_COUNT: 'returnsResumeCount',
    DEADLINE: 'deadline',
    RESPONSIBLE_RM: 'responsible',
    CREATION_DATE: 'createDate',
    RESPONSIBLE: 'responsibleForSaleRequestName',
    COUNT_RESUME: 'countResume',
    SALE: 'saleId',
};

export const DIRECTION = {
    ASC: 'asc',
    DESC: 'desc',
};

export const PAGE_SIZE = 20;

export const ALL_RESUME_REQUESTS = 'ALL_RESUME_REQUESTS';
