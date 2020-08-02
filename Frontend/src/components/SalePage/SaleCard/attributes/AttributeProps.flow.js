// @flow

import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { Contact, CommonListItem } from 'crm-types/resourceDataTypes';
import type { SingleActivity } from 'crm-containers/SalePage/SaleCard';
import type { Router } from 'react-router-dom';
import type { Sale } from 'crm-types/sales';

export type Classes = {
    label: string,
    paper: string,
    listLabel: string,
    modalInputWrapper: string,
    formControl: string,
    popOverItem: string,
    searchInput: string,
    comment: string,
    list: string,
    firstListItem: string,
    firstListItemStatic: string,
    listItem: string,
    chips: string,
    addActivityButton: string,
    preLead: string,
    lead: string,
    inWork: string,
    opportunity: string,
    contract: string,
    archive: string,
    listItemWithAddButton: string,
    all: string,
    paddingFix: string,
    mainContactButtonPadding: string,
    activitiesRemoveButtonPadding: string,
    listLabelActivities: string,
    idSale: string,
    headerWrapper: string,
    confirmationContent: string,
    confirmationFooter: string,
    title: string,
    firstListItemMoreFour: string,
    header: string,
    wrapperActivities: string,
    emptyBlock: string,
    mainContact: string,
}

export type Responsible = {
    additionalInfo: string,
    additionalPhone: string,
    email: string,
    firstName: string,
    id: number,
    lastName: string,
    phone: string,
    skype: string,
};

export type Props = {
    sale: Sale,
    saleId: number,
    classes: Classes,
    contactList: Array<Contact>,
    estimationsList: Array<CommonListItem>,
    resumesRequestsList: Array<CommonListItem>,
    fetchSaleCard: number => Promise<Sale>,
    editComment: (string) => void,
    deleteSaleCard: (number) => void,
    updateSaleCard: (id: number, Object) => void,
    fetchHeadOfSalesUserList: string => void,
    updateResumeForSale: (idResume: string, idSale: number) => void,
    updateEstimateForSale: (idEstimate: string, idSale: number) => void,
    addActivity: (activityInfo?: addActivityArguments, params?: fetchSalesArguments) => void,
    activities: Array<SingleActivity>,
    fetchActivities: (saleId: number, size: number, page: number) => void,
    page: number,
    userData: { username: string, roles: Array<string>, id: number},
    history: Router,
};

export type State = {
    sale: Sale,
};
