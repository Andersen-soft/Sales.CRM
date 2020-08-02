// @flow

export type BaseHeaders = {
    title: string,
    filtration: string,
    key: string,
    sorting: string | null,
}

export type Filters = {
    resumeRequest?: string | null,
    fio?: string | null,
    status?: Array<string> | null,
    responsibleHr?: Array<number> | null,
    isUrgent?: ?boolean,
};

export type DateRange = {
    from: string,
    to: string,
};

export type ResumeParameters = {
    createDate?: ?DateRange | Array<string>,
    page?: ?number,
    size?: number,
    sort?: ?string,
    resumeRequest?: ?string | ?number,
    fio?: ?string,
    status: ?Array<string>,
    responsibleHr?: ?Array<number>,
    isUrgent: ?boolean,
}

export type ResumeRequest = {
    id: number,
    name: string,
};

export type ResponsibleHr = {
    checked: boolean,
    firstName: string,
    id: number,
    lastName: string,
}

export type ResumeFields = {
    id: number,
    deadline: string,
    fio: string,
    status: string,
    comment: string,
    resumeRequest: ResumeRequest,
    responsibleHr: ResponsibleHr,
    isUrgent: ?boolean,
};

export type updateResumeArguments = {
    resumeId: number,
    responsibleHrId?: ?number,
    comment?: string,
    status?: string,
    fio?: string,
    isUrgent?: ?boolean,
};

export type List = {
    checked: boolean,
    firstName?: ?string,
    lastName?: ?string,
    id: number,
    value: string,
};

export type ListSuggestion = {
    label: string,
    +value: ?number,
}
