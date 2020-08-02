// @flow
import type { CommonListItem } from 'crm-types/resourceDataTypes';
import type { Responsible } from 'crm-components/SalePage/SaleCard/attributes/AttributeProps.flow';

export type Sale = {
    id: number,
    company: { id: number, name: string },
    createDate: string,
    description: string,
    estimations: Array<CommonListItem>,
    name: string,
    lastActivity: { dateActivity: string },
    mainContact: Object,
    mainContactId: number,
    nextActivityDate: string,
    responsible: Responsible,
    resumes: Array<CommonListItem>,
    status: string,
    nextActivityId: number,
    exported: boolean,
    source: ?{ id: number, name: string },
    recommendation: ?{ id: number, name: string },
    category: ?string,
};
