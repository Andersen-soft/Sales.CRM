// @flow

import type { Person } from 'crm-types/allResumeRequests';


export type Comment = {
    id: number,
    employee: Person,
    created: string,
    description: string,
    isEdited: boolean,
};

export type HistoryType = {
    id: number,
    date: string,
    employee: {
        id: string,
        firstName: string,
        lastName: string,
    },
    description: string,
};
