// @flow

export type Company = {
    id: number,
    name: string,
    url?: string,
    linkedSales: number[],
    phone?: string,
    description?: string,
    industryDtos: Array<{ id: number, name: string }>,
    responsibleRm: {
        id: number,
        firstName: string,
        lastName: string,
    }
}

export type AttributeProps = {
    company: Company,
    classes: Object,
    searchCompanyList: Company[],
    statuses: Array<string>,
    onEdit: (attrName: string) => void,
    onSave: (attr: string, value: $Values<Company>) => void,
    inEditMode: boolean,
    fetchCompanyCard: (number) => void,
    updateCompanyCard: (number, Object) => void,
    editComment: (string) => void,
    saleId: number,
    status: string,
    userRoles?: Array<string>,
    applyId: boolean,
    disabled?: boolean
};
