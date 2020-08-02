// @flow

export type Employee = {
    id: number,
    firstName: string,
    lastName: string
};

export type File = {
    addedDate: string,
    employee: Employee,
    id: number,
    name: string
};

export type EstimationRequest = {
    attachments: Array<File>,
    company: {
        id: number,
        name: string,
    },
    created: string,
    deadLine: string,
    employee?: Employee,
    id?: number,
    name?: string,
    priority?: string,
    responsible?: Employee,
    saleId?: number | null,
    status?: string,
}
