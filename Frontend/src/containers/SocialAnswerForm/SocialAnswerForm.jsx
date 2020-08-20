// @flow

import React, { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { withFormik } from 'formik';
import { path, sortBy } from 'ramda';
import { connect } from 'react-redux';

import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMAutocompleteSelect, { INPUT_CHANGE_ACTION } from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import GenderRadioGroup from 'crm-components/common/GenderRadioGroup';
import Notification from 'crm-components/notification/NotificationSingleton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';

import { useTranslation } from 'crm-hooks/useTranslation';

import { checkExistCompany, getCompaniesSearch } from 'crm-api/companyCardService/companyCardService';
import addSocialAnswer from 'crm-api/socialAnswerService';
import { getCountry, getAuthUserSocialContacts } from 'crm-api/contactsCard/contactsCardService';
import validatePhone from 'crm-utils/validatePhone';
import getValueOrNull from 'crm-utils/getValueOrNull';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { Grid, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { PHONE_REGEXP, EMAIL_REGEXP, SKYPE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import { MALE_KEY } from 'crm-constants/gender';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import type { FormikProps } from 'crm-types/formik';

import styles from './SocialAnswerFormStyles';

const validationSchema = Yup.object().shape({
    socialNetworkContactId: Yup.object().shape({
        label: Yup.string(),
        value: Yup.number(),
    }).nullable().required('forms.errorInputRequired'),
    selectedCountry: Yup.object().shape({
        label: Yup.string(),
        value: Yup.number(),
    }).nullable().required('forms.errorInputRequired'),
    firstName: Yup.string().required('forms.errorInputRequired'),
    lastName: Yup.string().required('forms.errorInputRequired'),
    linkLead: Yup.string().required('forms.errorInputRequired').url('forms.errorUrlValidation'),
    message: Yup.string().required('forms.errorInputRequired'),
    position: Yup.string().required('forms.errorInputRequired'),
    emailCorporate: Yup.string()
        .matches(EMAIL_REGEXP, {
            message: 'forms.errorEmailValidation',
            excludeEmptyString: true,
        }),
    emailPersonal: Yup.string()
        .matches(EMAIL_REGEXP, {
            message: 'forms.errorEmailValidation',
            excludeEmptyString: true,
        }),
    phone: Yup.string()
        .nullable()
        .matches(PHONE_REGEXP, {
            message: 'forms.errorPhoneValidation',
            excludeEmptyString: true,
        }),
    skype: Yup.string()
        .matches(SKYPE_REGEXP, {
            message: 'forms.errorSkypeValidation',
            excludeEmptyString: true,
        }),
});

type Props = FormikProps & {
    classes: Object,
    user: {
        username: string,
        roles: Array<string>
    },
}

const validate = values => values.companyName.name ? {} : { companyName: 'forms.errorInputRequired' };

const NEW_COMPANY_ID = -1;

const SocialAnswerForm = ({
    classes,
    user,
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    setStatus,
    errors,
    touched,
    status,
    setFieldTouched,
    setValues,
}: Props) => {
    const [countriesSuggestions, setCountriesSuggestions] = useState([]);
    const [socialContactsSuggestions, setSocialContactsSuggestions] = useState([]);

    const translations = {
        title: useTranslation('socialAnswerForm.common.title'),
        optionalField: useTranslation('socialAnswerForm.common.optionalField'),
        companyName: useTranslation('socialAnswerForm.columns.companyName'),
        virtualProfile: useTranslation('socialAnswerForm.columns.virtualProfile'),
        message: useTranslation('socialAnswerForm.columns.message'),
        name: useTranslation('socialAnswerForm.columns.name'),
        surname: useTranslation('socialAnswerForm.columns.surname'),
        country: useTranslation('socialAnswerForm.columns.country'),
        position: useTranslation('socialAnswerForm.columns.position'),
        leadProfile: useTranslation('socialAnswerForm.columns.leadProfile'),
        corporateEmail: useTranslation('socialAnswerForm.columns.corporateEmail'),
        personalEmail: useTranslation('socialAnswerForm.columns.personalEmail'),
        phoneNumber: useTranslation('socialAnswerForm.columns.phoneNumber'),
        skype: useTranslation('socialAnswerForm.columns.skype'),
        notificationSubmittedForm: useTranslation('socialAnswerForm.notification.notificationSubmittedForm'),
        notificationReplyAttached: useTranslation('socialAnswerForm.notification.notificationReplyAttached'),
        notificationCompanyExistsStart: useTranslation('socialAnswerForm.notification.notificationCompanyExistsStart'),
        notificationCompanyExistsEnd: useTranslation('socialAnswerForm.notification.notificationCompanyExistsEnd'),
        send: useTranslation('common.send'),
        cancel: useTranslation('common.cancel'),
        continue: useTranslation('common.continue'),
        errorCompanyName: useTranslation(errors.companyName),
        errorSocialNetworkContactId: useTranslation(errors.socialNetworkContactId),
        errorSelectedCountry: useTranslation(errors.selectedCountry),
        errorFirstName: useTranslation(errors.firstName),
        errorLastName: useTranslation(errors.lastName),
        errorLinkLead: useTranslation(errors.linkLead),
        errorMessage: useTranslation(errors.message),
        errorPosition: useTranslation(errors.position),
        errorEmailCorporate: useTranslation(errors.emailCorporate),
        errorEmailPersonal: useTranslation(errors.emailPersonal),
        errorPhone: useTranslation(errors.phone),
        errorSkype: useTranslation(errors.skype),
        birthday: useTranslation('sale.contactSection.addContact.birthday'),
    };

    values.translateSubmittedForm = translations.notificationSubmittedForm;

    useEffect(() => {
        (async () => {
            document.title = translations.title;

            const countries = await getCountry();
            const sortedCountries = sortBy(({ name }) => name, countries);
            const countriesSuggestionsData = sortedCountries.map(({ name, id }) => ({ label: name, value: id }));

            const { username } = user;
            const socialContacts = await getAuthUserSocialContacts({
                salesAssistantUsername: username,
                sort: 'socialNetworkUser.name,asc',
            });
            const socialContactsSuggestionsData = socialContacts.content.map(({
                id,
                socialNetworkUser: { name: socialName },
                source: { name: sourceName },
            }) => ({ label: `${socialName} - ${sourceName}`, value: id }));

            setCountriesSuggestions(countriesSuggestionsData);
            setSocialContactsSuggestions(socialContactsSuggestionsData);
        })();
    }, []);

    const existsCompanyDialogClose = () => setStatus({ showExistsCompanyDialog: false });

    const existsCompanyDialogContinue = async () => {
        try {
            await addSocialAnswer({
                ...values,
                companyName: values.companyName.name,
                countryId: values.selectedCountry.value,
                socialNetworkContactId: values.socialNetworkContactId.value,
                emailCorporate: getValueOrNull((values.emailCorporate).trim()),
                emailPersonal: getValueOrNull((values.emailPersonal).trim()),
                phone: getValueOrNull((values.phone).trim()),
                skype: getValueOrNull((values.skype).trim()),
                dateOfBirth: getDate(values.dateOfBirth, FULL_DATE_DS) || '',
            });

            resetForm();

            Notification.showMessage({
                type: 'success',
                message: translations.notificationSubmittedForm,
                closeTimeout: 15000,
            });
        } catch (error) {
            Notification.showMessage({
                message: error.message,
                closeTimeout: 15000,
            });
        }
    };

    const handlePhoneChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (validatePhone(value) || !value.length) {
            handleChange(event);
        }
    };

    const handleCompanySearch = (company: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(company, 150, CANCELED_REQUEST).then(({ content }) => callback(content));
    };

    const searchCompany = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleCompanySearch(searchCompanyValue, callback), 300), []);

    const handleCompanyInputChange = (inputValue, { action }) => {
        if (action === INPUT_CHANGE_ACTION) {
            const changeCompany = handleChange('companyName');

            if (!changeCompany) {
                return;
            }

            changeCompany({ id: NEW_COMPANY_ID, name: inputValue });
        }
    };

    const handleCompanyChange = async (newValue: {id: number, name: string} | null) => {
        if (newValue) {
            setValues({
                ...values,
                companyName: newValue,
            });
        } else {
            const changeCompany = handleChange('companyName');

            if (!changeCompany) {
                return;
            }

            changeCompany({ id: NEW_COMPANY_ID, name: '' });
        }
    };

    return (
        <Grid
            container
            className={classes.wrapperScroll}
        >
            <form
                onSubmit={handleSubmit}
                className={classes.wrapperForm}
            >
                <Paper
                    elevation={0}
                    classes={{ root: classes.wrapperPaper }}
                >
                    <Typography className={classes.typographyTitle}>
                        {translations.title}
                    </Typography>
                    <Grid container>
                        <Grid item className={classes.wrapperInput}>
                            <CRMAutocompleteSelect
                                loadOptions={searchCompany}
                                value={values.companyName}
                                onChange={handleCompanyChange}
                                onInputChange={handleCompanyInputChange}
                                onBlur={() => setFieldTouched('companyName', true)}
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id}
                                label={translations.companyName}
                                error={touched.companyName && translations.errorCompanyName}
                                isClearable={!errors.companyName}
                                cacheOptions
                                async
                                controlled
                                menuShouldBlockScroll
                                menuPosition={'fixed'}
                            />
                            <Grid className={classes.fieldSpacing}>
                                <CRMAutocompleteSelect
                                    options={socialContactsSuggestions}
                                    value={values.socialNetworkContactId}
                                    onChange={contact => setFieldValue('socialNetworkContactId', contact)}
                                    label={translations.virtualProfile}
                                    maxMenuHeight={250}
                                    error={touched.socialNetworkContactId && translations.errorSocialNetworkContactId}
                                    controlled
                                />
                            </Grid>
                            <CRMTextArea
                                value={values.message}
                                onChange={handleChange}
                                name='message'
                                label={translations.message}
                                error={touched.message && translations.errorMessage}
                                fullWidth
                                classes={{
                                    label: classes.textareaLabel,
                                    input: classes.textareaInput,
                                }}
                                rows={15}
                                rowsMax={15}
                                className={cn(classes.fieldSpacing, classes.lastField)}
                            />
                        </Grid>
                        <Grid item className={classes.wrapperInput}>
                            <CRMInput
                                onChange={handleChange}
                                value={values.firstName}
                                name='firstName'
                                label={translations.name}
                                error={touched.firstName && translations.errorFirstName}
                                fullWidth
                            />
                            <CRMInput
                                onChange={handleChange}
                                value={values.lastName}
                                name='lastName'
                                label={translations.surname}
                                error={touched.lastName && translations.errorLastName}
                                className={classes.fieldSpacing}
                                fullWidth
                            />
                            <Grid className={classes.fieldSpacing}>
                                <CRMAutocompleteSelect
                                    options={countriesSuggestions}
                                    value={values.selectedCountry}
                                    onChange={country => setFieldValue('selectedCountry', country)}
                                    label={translations.country}
                                    maxMenuHeight={250}
                                    error={touched.selectedCountry && translations.errorSelectedCountry}
                                    controlled
                                />
                            </Grid>
                            <CRMInput
                                onChange={handleChange}
                                value={values.position}
                                name='position'
                                label={translations.position}
                                error={touched.position && translations.errorPosition}
                                className={classes.fieldSpacing}
                                fullWidth
                            />
                            <CRMInput
                                onChange={handleChange}
                                onBlur={() => setFieldTouched('linkLead', true)}
                                value={values.linkLead}
                                name='linkLead'
                                label={translations.leadProfile}
                                error={touched.linkLead && translations.errorLinkLead}
                                fullWidth
                                placeholder='http://'
                                className={classes.fieldSpacing}
                            />
                            <Grid className={cn(classes.fieldSpacing, classes.lastField)}>
                                <GenderRadioGroup
                                    onChange={handleChange}
                                    value={values.sex}
                                    name='sex'
                                    fullWidth
                                    label
                                    row
                                />
                            </Grid>
                        </Grid>
                        <Grid item className={classes.wrapperInput}>
                            <Typography className={cn(classes.typographyComment, classes.topComment)}>{translations.optionalField}</Typography>
                            <CRMDatePicker
                                date={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                onChange={date => setFieldValue('dateOfBirth', date)}
                                maxDate={new Date()}
                                InputProps={{
                                    classes: { root: classes.dateRoot },
                                }}
                                label={translations.birthday}
                                clearable
                                fullWidth
                                showMonthAndYearPickers
                            />
                            <Typography className={classes.typographyComment}>{translations.optionalField}</Typography>
                            <CRMInput
                                onChange={handleChange}
                                onBlur={() => setFieldTouched('emailCorporate', true)}
                                value={values.emailCorporate}
                                name='emailCorporate'
                                label={translations.corporateEmail}
                                error={touched.emailCorporate && translations.errorEmailCorporate}
                                fullWidth
                            />
                            <Typography className={classes.typographyComment}>{translations.optionalField}</Typography>
                            <CRMInput
                                onChange={handleChange}
                                onBlur={() => setFieldTouched('emailPersonal', true)}
                                value={values.emailPersonal}
                                name='emailPersonal'
                                label={translations.personalEmail}
                                error={touched.emailPersonal && translations.errorEmailPersonal}
                                fullWidth
                            />
                            <Typography className={classes.typographyComment}>{translations.optionalField}</Typography>
                            <CRMInput
                                onChange={handlePhoneChange}
                                value={values.phone}
                                name='phone'
                                label={translations.phoneNumber}
                                error={touched.phone && translations.errorPhone}
                                fullWidth
                            />
                            <Typography className={classes.typographyComment}>{translations.optionalField}</Typography>
                            <CRMInput
                                onChange={handleChange}
                                onBlur={() => setFieldTouched('skype', true)}
                                value={values.skype}
                                name='skype'
                                label={translations.skype}
                                error={touched.skype && translations.errorSkype}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <CRMButton
                        primary
                        type='submit'
                        variant='action'
                        className={classes.button}
                    >
                        {translations.send}
                    </CRMButton>
                </Paper>
            </form>
            {values.companyName.name && (
                <CancelConfirmation
                    showConfirmationDialog={status && status.showExistsCompanyDialog}
                    onConfirmationDialogClose={existsCompanyDialogClose}
                    onConfirm={existsCompanyDialogContinue}
                    text={(
                        <>
                            <Grid>
                                {translations.notificationCompanyExistsStart}
                                <span className={classes.dialogTextBold}> {values.companyName.name} </span>
                                {translations.notificationCompanyExistsEnd}
                            </Grid>
                            <Grid className={classes.dialogBody}>
                                {translations.notificationReplyAttached}
                                <span className={classes.dialogTextBold}>{` '${values.companyName.name}'`}</span>
                            </Grid>
                        </>
                    )}
                    textCancel={translations.cancel}
                    textApply={translations.continue}
                />
            )}
        </Grid>
    );
};

const StyledSocialAnswerForm = withStyles(styles)(SocialAnswerForm);

const FormikedSocialAnswerForm = withFormik({
    mapPropsToValues: () => ({
        companyName: '',
        socialNetworkContactId: null,
        selectedCountry: null,
        firstName: '',
        lastName: '',
        linkLead: '',
        message: '',
        sex: MALE_KEY,
        position: '',
        emailCorporate: '',
        emailPersonal: '',
        phone: '',
        skype: '',
        translateSubmittedForm: '',
        dateOfBirth: null,
    }),
    mapPropsToStatus: () => ({
        showExistsCompanyDialog: false,
    }),
    isInitialValid: false,
    handleSubmit: async (values, { resetForm, setStatus }) => {
        try {
            const checkCompanyExistence = await checkExistCompany(values.companyName.name);
            const companyId = path(['id'], checkCompanyExistence);

            if (companyId) {
                setStatus({ showExistsCompanyDialog: true });
                return;
            }

            const translateNotification = values.translateSubmittedForm;

            delete values.translateSubmittedForm;

            await addSocialAnswer({
                ...values,
                companyName: values.companyName.name,
                countryId: values.selectedCountry.value,
                socialNetworkContactId: values.socialNetworkContactId.value,
                emailCorporate: getValueOrNull((values.emailCorporate).trim()),
                emailPersonal: getValueOrNull((values.emailPersonal).trim()),
                phone: getValueOrNull((values.phone).trim()),
                skype: getValueOrNull((values.skype).trim()),
                dateOfBirth: getDate(values.dateOfBirth, FULL_DATE_DS) || '',
            });

            resetForm();

            Notification.showMessage({
                type: 'success',
                message: translateNotification,
                closeTimeout: 15000,
            });
        } catch (error) {
            Notification.showMessage({
                message: error.message,
                closeTimeout: 15000,
            });
        }
    },
    validate,
    validationSchema,
})(StyledSocialAnswerForm);

export default connect(
    state => ({ user: state.session.userData })
)(FormikedSocialAnswerForm);
