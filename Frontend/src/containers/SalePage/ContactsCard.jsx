// @flow
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import ContactsCard from 'crm-components/SalePage/contactsCard/ContactsCard';

import {
    fetchContacts,
    updateOneContact,
    deleteOneContact,
    createOneContact,
} from 'crm-actions/salePageActions/contactsCardActions';
import { fetchSaleCard, updateSaleCard } from 'crm-actions/salePageActions/saleCardActions';
import { fetchCompanyCard } from 'crm-actions/salePageActions/companyCardActions';
import { fetchActivities } from 'crm-actions/salePageActions/activitiesHistoryActions';
import type { Company } from 'crm-components/SalePage/CompanyCard/attributes/AttributeProps.flow';

type ContactsType = {
    country: string,
    email: string,
    firstName: string,
    id: number,
    isActive: boolean,
    lastName: string,
    personalEmail: string,
    phone: string,
    position: string,
    skype: string,
    socialContact: string,
    socialNetwork: string,
    source: { id: number, name: string },
};

type CountriesType = {
    id: number;
    name: string;
    alpha2: string;
    alpha3: string;
}

type ContactState = {
    contacts: Array<ContactsType>;
    countriesList: Array<CountriesType>;
    isLoading: boolean;
};

type State = {
    CompanyCard: {
        companyCard: Company,
        searchCompanyList: Company[],
    },
    ContactsList: ContactState;
    SaleCard: {
        sale: {
            status: string,
            mainContactId: number,
            responsible: Object,
            mainContact: Object,
        },
    },
    session: Object,
};

const mapStateToProps = (state: State) => ({
    mainContactId: state.SaleCard.sale.mainContactId,
    mainContact: state.SaleCard.sale.mainContact,
    company: state.CompanyCard.companyCard,
    contacts: state.ContactsList.contacts,
    countriesList: state.ContactsList.countriesList,
    status: state.SaleCard.sale.status,
    userData: state.session.userData,
    responsibleId: pathOr(null, ['SaleCard', 'sale', 'responsible', 'id'], state),
});

const mapDispatchToProps = {
    fetchContacts,
    updateOneContact,
    deleteOneContact,
    createOneContact,
    fetchSaleCard,
    fetchActivities,
    fetchCompanyCard,
    updateSaleCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsCard);
