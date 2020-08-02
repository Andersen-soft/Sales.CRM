// @flow

export type Person = {
    firstName: string,
    id: number,
    lastName: string,
};

export type Company = {
    id: number,
    name: string,
};

export type ResumeRequest = {
    id: number,
    name: string,
    company: Company,
    status: string,
    deadLine: string,
    responsible: ?string,
    resumeRequestId: number,
    created: string,
    responsibleForSaleRequestId: ?number,
    companySaleId: number,
    deadline: string,
    responsibleForSaleRequestName: string,
    responsibleId: number,
    companyName: string,
    createDate: string,
    countResume: number,
    returnsResumeCount: number,
};

export type Filters = {
    status?: Array<string> | null,
    companyId?: number | null,
    responsibleForSaleRequestId?: number | null,
    responsibleId?: number | null,
    name?: string | null,
    'resumes.responsibleHr.id'?: Array<number>,
    'resumes.status'?: Array<string>,
};
