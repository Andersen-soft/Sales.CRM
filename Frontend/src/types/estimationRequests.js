// @flow

export type Company = {
    id: number,
    name: string,
};

type Employee = {
    id: string,
    firstName: string,
    lastName: string,
}

export type HistoryType = {
    id: number,
    createDate: string,
    employee: Employee,
    description: string,
};

export type EstimationRequest = {
    id: number,
    name: string,
    companyName: string,
    status: string,
    deadLine: string,
    responsible: ?string,
    resumeRequestId: number,
    created: string,
    saleId: number,
    responsibleForSaleRequest: Employee,
    responsibleForRequest: Employee,
};

export type fetchAllEstimationRequestsArguments = {
    page?: ?number,
    size?: number,
    isActive?: boolean,
    sort?: string,
    status?: Array<string> | null,
    company?: number | null,
    responsibleForSaleRequest?: number | null,
    responsibleForRequest?: number | null,
    name?: string | null,
};

export type Filters = {
    status?: Array<string> | null,
    company?: number | null,
    responsibleForSaleRequest?: number | null,
    responsibleForRequest?: number | null,
    name?: string | null,
}

export type EstimationRequestState = {
    page: number,
    filters: Filters,
    sort: string,
}
