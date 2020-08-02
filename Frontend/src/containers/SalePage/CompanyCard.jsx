// @flow

import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { CompanyCard } from 'crm-components/SalePage/CompanyCard';
import {
    fetchCompanyCard,
    updateCompanyCard,
    editComment,
    fetchSearchCompanyList,
    updateCompanyForSale,
} from 'crm-actions/salePageActions/companyCardActions';
import { fetchContacts } from 'crm-actions/salePageActions/contactsCardActions';
import { fetchActivities } from 'crm-actions/salePageActions/activitiesHistoryActions';
import { deleteSaleCard } from 'crm-actions/salePageActions/saleCardActions';
import { fetchSale } from 'crm-actions/salePageActions/salePageActions';
import type { Company } from 'crm-types/resourceDataTypes';
import type { SingleActivity } from 'crm-containers/SalePage/SaleCard';

type State = {
    CompanyCard: {
        companyCard: Company,
        searchCompanyList: Company[],
    },
    SaleCard: {
        sale: {
            status: string,
            responsible: Object,
            resumes: Array<?Object>,
            estimations: Array<?Object>,
            id: number,
            exported: boolean,
        },
    },
    ActivitiesHistory: {
        activities: Array<SingleActivity>,
    },
    session: Object,
}

const mapStateToProps = (state: State) => ({
    resumes: state.SaleCard.sale.resumes,
    isSaleExported: pathOr(false, ['SaleCard', 'sale', 'exported'], state),
    estimations: state.SaleCard.sale.estimations,
    company: state.CompanyCard.companyCard,
    searchCompanyList: state.CompanyCard.searchCompanyList,
    saleStatus: state.SaleCard.sale.status,
    userData: state.session.userData,
    activities: state.ActivitiesHistory.activities,
    responsibleId: pathOr(null, ['SaleCard', 'sale', 'responsible', 'id'], state),
});

const mapDispatchToProps = {
    fetchCompanyCard,
    updateCompanyCard,
    editComment,
    fetchSearchCompanyList,
    updateCompanyForSale,
    fetchSale,
    fetchContacts,
    fetchActivities,
    deleteSaleCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard);
