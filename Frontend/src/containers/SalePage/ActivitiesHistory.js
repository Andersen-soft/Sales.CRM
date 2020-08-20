// @flow

import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import ActivitiesHistoryTable from 'crm-components/SalePage/activitiesHistoryTable/ActivitiesHistoryTable';
import {
    fetchActivities,
    fetchActivitiesTypes,
    updateActivityTable,
    deleteOneActivity,
    fetchSearchActivity,
} from 'crm-actions/salePageActions/activitiesHistoryActions';
import {
    fetchSaleCard,
    addActivity,
    updateSaleCard,
} from 'crm-actions/salePageActions/saleCardActions';

type SingleActivity = {
    contacts: string;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    types: string;
}

type ContactsType = {
    id?: number;
    firstName: string;
    lastName: string;
}

type ActivitiesHistoryState = {
    activities: Array<SingleActivity>,
    typesActivity: Array<String>,
    contactsList: Array<ContactsType>,
    activitiesCount: number;
    isLoading: boolean,
}

type State = {
    ActivitiesHistory: ActivitiesHistoryState,
    SaleCard: {
        sale: {
            status: string,
            responsible: Object,
            mainContactId: number,
            company: { id: number }
        },
    },
    ContactsList: {
        contacts: Array<ContactsType>,
    },
    session: Object,
};

const mapStateToProps = (state: State) => ({
    activities: state.ActivitiesHistory.activities,
    typesActivity: state.ActivitiesHistory.typesActivity,
    contactsList: state.ContactsList.contacts,
    activitiesCount: state.ActivitiesHistory.activitiesCount,
    status: state.SaleCard.sale.status,
    companyId: state.SaleCard.sale.company.id,
    mainContactId: state.SaleCard.sale.mainContactId,
    isLoading: state.ActivitiesHistory.isLoading,
    userData: state.session.userData,
    responsibleId: pathOr(null, ['SaleCard', 'sale', 'responsible', 'id'], state),
});

const mapDispatchToProps = {
    fetchActivities,
    fetchSaleCard,
    fetchActivitiesTypes,
    updateActivityTable,
    deleteOneActivity,
    fetchSearchActivity,
    addActivity,
    updateSaleCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesHistoryTable);
