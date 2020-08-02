// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import { Grid } from '@material-ui/core';
import { CRM_DAY_FULL_MONTH_FORMAT } from 'crm-constants/dateFormat';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import { KEY_ENTER } from 'crm-constants/keyCodes';

import styles from '../SearchStyles';

type Suggestion = {
    value: number,
    label: string,
};

type SearchParams = {
    fio?: string,
    skype?: string,
    phone?: string,
    email?: string,
    socialNetworkLink?: string,
    country?: Suggestion,
    birthday?: ?{ from: Date, to: Date },
}

type Props = {
    classes: Object,
    searchParams: SearchParams,
    changeSearchParams: (key: string, value: string | Object) => void,
    countryListSuggestions: Array<Suggestion>,
    searchContacts: () => void,
    loadingCountry: boolean,
    clearSearchParams: () => void,
}

const ContactsSearchForm = ({
    classes,
    searchParams: {
        fio = '',
        skype = '',
        phone = '',
        email = '',
        socialNetworkLink = '',
        country = null,
        birthday = null,
    },
    changeSearchParams,
    countryListSuggestions,
    searchContacts,
    loadingCountry,
    clearSearchParams,
}: Props) => {
    const translations = {
        fio: useTranslation('globalSearch.fio'),
        phone: useTranslation('globalSearch.phone'),
        socialNetworkLink: useTranslation('globalSearch.socialNetworkLink'),
        country: useTranslation('globalSearch.country'),
        birthday: useTranslation('globalSearch.birthday'),
        find: useTranslation('globalSearch.find'),
        clear: useTranslation('globalSearch.clear'),
    };

    const handleKeyPress = event => event.key === KEY_ENTER.key && searchContacts();

    return (
        <Grid
            container
            direction='column'
        >
            <Grid
                item
                container
                sm={12}
                md={11}
                lg={9}
                xl={7}
            >
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={({ target: { value } }) => changeSearchParams('fio', value)}
                        onKeyPress={handleKeyPress}
                        value={fio}
                        label={translations.fio}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={({ target: { value } }) => changeSearchParams('skype', value)}
                        onKeyPress={handleKeyPress}
                        value={skype}
                        label='Skype'
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={({ target: { value } }) => changeSearchParams('phone', value)}
                        onKeyPress={handleKeyPress}
                        value={phone}
                        label={translations.phone}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={({ target: { value } }) => changeSearchParams('email', value)}
                        onKeyPress={handleKeyPress}
                        value={email}
                        label='E-mail'
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={({ target: { value } }) => changeSearchParams('socialNetworkLink', value)}
                        onKeyPress={handleKeyPress}
                        value={socialNetworkLink}
                        label={translations.socialNetworkLink}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMAutocompleteSelect
                        onChange={newValue => changeSearchParams('country', newValue)}
                        options={countryListSuggestions}
                        value={country}
                        label={translations.country}
                        controlled
                        containerStyles={{ marginTop: 22 }}
                        isLoading={loadingCountry}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMDateRangeInput
                        onSelectRange={(from, to) => changeSearchParams('birthday', from ? { from, to } : null)}
                        startDate={pathOr(null, ['from'], birthday)}
                        endDate={pathOr(null, ['to'], birthday)}
                        label={translations.birthday}
                        inputDateFormat={CRM_DAY_FULL_MONTH_FORMAT}
                        hideYear
                    />
                </Grid>
            </Grid>
            <Grid
                container
                item
                className={classes.buttonRow}
            >
                <CRMButton
                    primary
                    onClick={searchContacts}
                    size='large'
                    className={classes.button}
                >
                    {translations.find}
                </CRMButton>
                <CRMButton
                    onClick={clearSearchParams}
                    size='large'
                >
                    {translations.clear}
                </CRMButton>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(ContactsSearchForm);
