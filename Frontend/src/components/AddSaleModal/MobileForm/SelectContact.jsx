// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import {
    Grid,
    Typography,
    Button,
} from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import NewContactForm from 'crm-components/common/newContactForm/NewContactForm';
import ContactList from '../attributes/ContactList';
import { EXISTING_CONTACT, NEW_CONTACT } from 'crm-constants/addSaleModal/addSaleModalConstatnts';

import type { Contact } from 'crm-types/resourceDataTypes';

import styles from './MobileFormStyles';

type Props = {
    classes: Object,
    values: Object,
    errors: Object,
    touched: Object,
    handleChangeContactCheckbox: (SyntheticInputEvent<HTMLInputElement>) => void,
    contactFetchValues: {
        countriesSuggestions: { label: string, value: number },
        countryId: number,
        socialContactsSuggestions: { label: string, value: number },
    },
    fetchContactValues: () => Promise<*>,
    handleChangeContactFields: (string, any) => void,
    handleBlur: (string) => (SyntheticInputEvent<HTMLInputElement>) => void,
    trimValue: (SyntheticInputEvent<HTMLInputElement>) => void,
    contactsList: Array<Contact>,
    selectContact: (Contact) => void,
    isCheckedContacts: (number) => boolean,
    loadingContacts: boolean,
}

const SelectContact = ({
    classes,
    values,
    errors,
    touched,
    handleChangeContactCheckbox,
    contactFetchValues,
    fetchContactValues,
    handleChangeContactFields,
    handleBlur,
    trimValue,
    contactsList,
    selectContact,
    isCheckedContacts,
    loadingContacts,
}: Props) => {
    const translations = {
        contactDetails: useTranslation('header.reportAddSale.contact.contactDetails'),
        contactNew: useTranslation('header.reportAddSale.contact.contactNew'),
        contactExist: useTranslation('header.reportAddSale.contact.contactExist'),
        contact: useTranslation('header.reportAddSale.contact.contact'),
        newContactInfo: useTranslation('header.reportAddSale.contact.newContactInfo'),
        selectContact: useTranslation('header.reportAddSale.contact.selectContact'),
    };

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            alignItems='stretch'
        >
            <Typography className={classes.title}>
                {translations.contact}
            </Typography>
            <Grid
                className={classes.buttonWrapper}
                container
                alignItems='center'
                justify='space-between'
            >
                <Button
                    className={cn(classes.button, { [classes.activeButton]: values.createNewContact === NEW_CONTACT })}
                    onClick={event => {
                        event.target.value = NEW_CONTACT;
                        handleChangeContactCheckbox(event);
                    }}
                >
                    {translations.contactNew}
                </Button>
                <Button
                    className={cn(classes.button, { [classes.activeButton]: values.createNewContact === EXISTING_CONTACT })}
                    onClick={event => {
                        event.target.value = EXISTING_CONTACT;
                        handleChangeContactCheckbox(event);
                    }}
                >
                    {translations.contactExist}
                </Button>
            </Grid>
            {values.createNewContact === NEW_CONTACT
                ? <>
                    <Typography className={classes.subTitle}>
                        {translations.newContactInfo}
                    </Typography>
                    <NewContactForm
                        valuesFromRequest={contactFetchValues}
                        fetchValues={fetchContactValues}
                        values={values}
                        onHandleChange={handleChangeContactFields}
                        onHandleBlur={handleBlur}
                        onHandleBlurTrim={trimValue}
                        errors={errors}
                        touched={touched}
                        alignItemForGrid='flex-start'
                        classes={{
                            rightColumnContainer: classes.rightColumnContainer,
                            leftColumnContainer: classes.leftColumnContainer,
                        }}
                    />
                </>
                : <>
                    <Typography className={classes.subTitle}>
                        {translations.selectContact}
                    </Typography>
                    <ContactList
                        classes={classes}
                        contactsList={contactsList}
                        selectContact={selectContact}
                        isCheckedContacts={isCheckedContacts}
                        values={values}
                        loadingContacts={loadingContacts}
                    />
                </>
            }
        </Grid>
    );
};

export default withStyles(styles)(SelectContact);
