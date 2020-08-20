// @flow

import { connect } from 'react-redux';
import { SaleCard } from 'crm-components/SalePage/SaleCard';
import {
    fetchSaleCard,
    updateSaleCard,
    deleteSaleCard,
    editComment,
    updateResumeForSale,
    updateEstimateForSale,
    addActivity,
} from 'crm-actions/salePageActions/saleCardActions';
import { fetchActivities } from 'crm-actions/salePageActions/activitiesHistoryActions';
import type { CommonListItem } from 'crm-types/resourceDataTypes';

export type Sale = {
    id?: number,
    company: { id: number, name: string },
    createDate?: string,
    description?: string,
    estimations?: Array<CommonListItem>,
    name?: string,
    lastActivityDate?: string,
    mainContact?: string,
    nextActivityDate?: string,
    responsible?: string,
    resumes?: Array<CommonListItem>,
    status?: string,
    nextActivityId?: number,
    distributedEmployeeId: number | null,
    inDayAutoDistribution: boolean,
    source: ?{ id: number, name: string },
    recommendation: ?{ id: number, name: string },
};

type ContactItem = {
    firstName?: string,
    lastName?: string,
}

type ResumeItem = {
    id?: number,
    title?: string,
}

export type SingleActivity = {
    contacts: string;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    types: string;
}

export type State = {
    SaleCard: {
        sale: Sale,
        salesUserList: Array<ContactItem>,
        headOfSalesUserList: Array<ContactItem>,
        resumesRequestsList: Array<ResumeItem>,
        estimationsList: Array<ResumeItem>,
        isLoading: boolean,
    },
    ContactsList: {
        contacts: Array<ContactItem>,
    },
    session: {
        userData: { username: string, roles: Array<string> } | null,
    },
}

const mapStateToProps = (state: State) => ({
    sale: state.SaleCard.sale,
    contactList: state.ContactsList.contacts,
    resumesRequestsList: state.SaleCard.resumesRequestsList,
    estimationsList: state.SaleCard.estimationsList,
    userData: state.session.userData,
    isLoading: state.SaleCard.isLoading,
});

const mapDispatchToProps = {
    fetchSaleCard,
    updateSaleCard,
    deleteSaleCard,
    editComment,
    updateResumeForSale,
    updateEstimateForSale,
    addActivity,
    fetchActivities,
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleCard);
