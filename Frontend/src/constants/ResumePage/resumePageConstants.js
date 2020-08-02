// @flow

export const CREATE_NEW_RESUME_TOPIC: string = '/topic/resume_request/resume/create';
export const UPDATE_RESUME_TOPIC: string = '/topic/resume_request/resume/update';
export const DELETE_RESUME_TOPIC: string = '/topic/resume_request/deleted_resume';
export const UPDATE_RSUME_REQUEST_NAME_OR_DEADLINE_TOPIC = '/topic/resume_request/update/name_or_deadline';

export const PAGE_SIZE = 20;

export const RESUME_FILTERS = 'resume_filters';

export const ACTUAL_FILTER = {
    actual: {
        key: 'actual',
        value: ['HR Need', 'In progress'],
    },
    notActual: {
        key: 'notActual',
        value: ['Done', 'Pending', 'CTO Need'],
    },
    all: {
        key: 'all',
        value: ['HR Need', 'In progress', 'Done', 'Pending', 'CTO Need'],
    },
    default: {
        key: 'default',
        value: ['HR Need', 'In progress', 'Done', 'Pending', 'CTO Need'],
    },
};

export const URGENT_FILTER = {
    all: null,
    urgent: true,
    notUrgent: false,
};
