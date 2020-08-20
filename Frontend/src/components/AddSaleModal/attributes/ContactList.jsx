// @flow

import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Grid,
} from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMCheckBox from 'crm-ui/CRMCheckbox/CRMCheckbox';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import type { Contact } from 'crm-types/resourceDataTypes';

type Props = {
    classes: Object,
    contactsList: Array<Contact>,
    selectContact: (contact: Contact) => Function,
    isCheckedContacts: (id: number) => Function,
    values: Object,
    loadingContacts: boolean,
};

const NEW_COMPANY = 'newCompany';

const ContactList = ({
    classes,
    contactsList,
    selectContact,
    isCheckedContacts,
    values,
    loadingContacts,
}: Props) => {
    const translations = {
        emptyBlock: useTranslation('common.emptyBlock'),
        companyErrorNotContacts: useTranslation('header.reportAddSale.company.companyErrorNotContacts'),
    };

    if (loadingContacts) {
        return <CRMLoader />;
    }

    return (values.createNewCompany === NEW_COMPANY || !values.company)
        ? <Grid>{translations.emptyBlock}</Grid>
        : <List>
            {contactsList.length === 0
                ? translations.companyErrorNotContacts
                : contactsList.map(contact => (
                    <ListItem
                        key={contact.id}
                        onClick={selectContact(contact)}
                    >
                        <CRMCheckBox
                            checked={isCheckedContacts(contact.id)}
                            value={`${contact.id}`}
                        />
                        <ListItemText primary={`${contact.firstName} ${contact.lastName}`} />
                    </ListItem>
                ))
            }
        </List>;
};

export default ContactList;
