// @flow

import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Input from 'crm-components/crmUI/CRMInput/CRMInput';
import GenderRadioGroup from 'crm-components/common/GenderRadioGroup';
import AutoComplete from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import validatePhone from 'crm-utils/validatePhone';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';

import styles from './NewContactFormStyles';

type Suggestion = {
    label: string,
    value: number | string,
};

type RequestValues = {
    countriesSuggestions: Array<Suggestion>,
    countryId: string,
    socialContactsSuggestions: Array<Suggestion>,
};

type Props = {
    alignItemForGrid: string,
    valuesFromRequest: RequestValues,
    fetchValues: Function,
    className: Object,
    onHandleChange: (string, number | string | ?Date) => void,
    onHandleBlur: (event: SyntheticEvent<EventTarget> | string) => void,
    onHandleBlurTrim: (event: SyntheticEvent<EventTarget>) => void,
    values: Object,
    errors: {
        firstName: string,
        personalEmail: string,
        email: string,
        socialNetwork: string,
        socialNetworkUserId: string,
        contactPhone: string,
        countryId: string,
    },
    touched: {
        firstName: string,
        personalEmail: string,
        email: string,
        socialNetwork: string,
        socialNetworkUserId: string,
        contactPhone: string,
        countryId: string,
    },
    classes: Object,
};

const NewContactForm = ({
    alignItemForGrid = 'center',
    valuesFromRequest: {
        countriesSuggestions,
        countryId,
        socialContactsSuggestions,
    },
    fetchValues,
    className,
    onHandleChange,
    onHandleBlur,
    onHandleBlurTrim,
    values: {
        socialNetworkUserId,
        personalEmail,
        email,
        skype,
        socialNetwork,
        firstName,
        lastName,
        position,
        contactPhone,
        sex,
        dateOfBirth,
    },
    errors,
    touched,
    classes,
}: Props) => {
    const translations = {
        name: useTranslation('sale.contactSection.addContact.name'),
        surname: useTranslation('sale.contactSection.addContact.surname'),
        country: useTranslation('sale.contactSection.addContact.country'),
        position: useTranslation('sale.contactSection.addContact.position'),
        phoneNumber: useTranslation('sale.contactSection.addContact.phoneNumber'),
        personalEmail: useTranslation('sale.contactSection.addContact.personalEmail'),
        corporateEmail: useTranslation('sale.contactSection.addContact.corporateEmail'),
        skype: useTranslation('sale.contactSection.addContact.skype'),
        socialNetworkLink: useTranslation('sale.contactSection.addContact.socialNetworkLink'),
        virtualProfile: useTranslation('sale.contactSection.addContact.virtualProfile'),
        errorFirstName: useTranslation(errors.firstName),
        errorCountry: useTranslation(errors.countryId),
        erroreEmail: useTranslation(errors.email),
        errorPersonalEmail: useTranslation(errors.personalEmail),
        errorSocialNetwork: useTranslation(errors.socialNetwork),
        birthday: useTranslation('sale.contactSection.addContact.birthday'),
    };

    useEffect(() => { fetchValues(); }, []);

    const handleSelectChange = (formControl: string) => (option: RequestValues & { value: string }) => {
        const valueForPayload = option ? option.value : '';

        onHandleChange(formControl, valueForPayload);
    };

    const handlePhoneChange = (formControl: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
        const { target: { value } } = event;

        if (validatePhone(value) || !value.length) {
            onHandleChange(formControl, value);
        }
    };

    const textFieldChange = (fieldName: string) => ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        onHandleChange(fieldName, value);
    };

    const leftColumn = () => (
        <Grid
            item
            container
            xs={12} sm={6}
            className={classes.leftColumnContainer}
        >
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='firstName'
                    label={translations.name}
                    value={firstName}
                    onChange={textFieldChange('firstName')}
                    onBlur={onHandleBlur('firstName')}
                    error={touched.firstName && translations.errorFirstName}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='lastName'
                    label={translations.surname}
                    value={lastName}
                    onChange={textFieldChange('lastName')}
                    onBlur={onHandleBlurTrim}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <CRMDatePicker
                    date={dateOfBirth ? new Date(dateOfBirth) : null}
                    onChange={date => onHandleChange('dateOfBirth', date)}
                    maxDate={new Date()}
                    InputProps={{
                        classes: { root: classes.dateRoot },
                    }}
                    label={translations.birthday}
                    clearable
                    fullWidth
                    showMonthAndYearPickers
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.select}
            >
                <AutoComplete
                    variant='outlined'
                    options={countriesSuggestions}
                    value={countryId}
                    onChange={handleSelectChange('countryId')}
                    onBlur={onHandleBlur('countryId')}
                    containerStyles={{ marginTop: 22 }}
                    label={translations.country}
                    maxMenuHeight={218}
                    error={touched.countryId && translations.errorCountry}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='position'
                    label={translations.position}
                    value={position}
                    onChange={textFieldChange('position')}
                    onBlur={onHandleBlurTrim}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={cn(classes.field, classes.lastField)}
            >
                <Input
                    fullWidth
                    name='contactPhone'
                    label={translations.phoneNumber}
                    value={contactPhone}
                    onChange={handlePhoneChange('contactPhone')}
                    onBlur={onHandleBlurTrim}
                    error={touched.contactPhone && errors.contactPhone}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
        </Grid>
    );

    const rightColumn = () => (
        <Grid
            item
            container
            xs={12} sm={6}
            className={classes.rightColumnContainer}
        >
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='personalEmail'
                    label={translations.personalEmail}
                    value={personalEmail}
                    placeholder='name@gmail.com'
                    onChange={textFieldChange('personalEmail')}
                    onBlur={onHandleBlur('personalEmail')}
                    error={touched.personalEmail && translations.errorPersonalEmail}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='email'
                    label={translations.corporateEmail}
                    value={email}
                    placeholder='name@gmail.com'
                    onChange={textFieldChange('email')}
                    onBlur={onHandleBlur('email')}
                    error={touched.email && translations.erroreEmail}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='skype'
                    label={translations.skype}
                    value={skype}
                    onChange={textFieldChange('skype')}
                    onBlur={onHandleBlurTrim}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.field}
            >
                <Input
                    fullWidth
                    name='socialNetwork'
                    label={translations.socialNetworkLink}
                    placeholder='http://'
                    value={socialNetwork}
                    onChange={textFieldChange('socialNetwork')}
                    onBlur={onHandleBlur('socialNetwork')}
                    error={touched.socialNetwork && translations.errorSocialNetwork}
                    InputLabelProps={{ classes: { root: classes.label } }}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={classes.select}
            >
                <AutoComplete
                    variant='outlined'
                    options={socialContactsSuggestions}
                    value={socialNetworkUserId}
                    onChange={handleSelectChange('socialNetworkUserId')}
                    containerStyles={{ marginTop: 22 }}
                    label={translations.virtualProfile}
                    maxMenuHeight={218}
                    menuPlacement='top'
                    error={touched.socialNetworkUserId && errors.socialNetworkUserId}
                />
            </Grid>
            <Grid
                item
                xs={12}
                className={cn(classes.field, classes.lastField)}
            >
                <GenderRadioGroup
                    onChange={textFieldChange('sex')}
                    value={sex}
                    name='sex'
                    fullWidth
                    label
                    row
                />
            </Grid>
        </Grid>
    );

    return (
        <Grid
            className={className}
            container
            item
            wrap='wrap'
            justify='flex-start'
            alignItems={alignItemForGrid}
            xs={12}
        >
            { leftColumn() }
            { rightColumn() }
        </Grid>

    );
};

export default withStyles(styles)(NewContactForm);
