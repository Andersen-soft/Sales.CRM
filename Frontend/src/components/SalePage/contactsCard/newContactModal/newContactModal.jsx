// @flow

import React, { useState } from 'react';
import {
    Grid,
    Dialog,
    DialogTitle,
    IconButton,
    FormControlLabel,
} from '@material-ui/core';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { path, sortBy, uniqBy } from 'ramda';
import { Clear } from '@material-ui/icons';

import NewContactForm from 'crm-components/common/newContactForm/NewContactForm';
import { PHONE_VALIDATION_ERR } from 'crm-constants/forms';
import { PHONE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import CRMIcon from 'crm-icons/CRMIcon';
import getValueOrNull from 'crm-utils/getValueOrNull';
import { getAuthUserSocialContacts, getCountry } from 'crm-api/contactsCard/contactsCardService';
import type { FormikProps } from 'crm-types/formik';
import { useTranslation } from 'crm-hooks/useTranslation';
import { MALE_KEY } from 'crm-constants/gender';
import CRMSwitch from 'crm-ui/CRMSwitch/CRMSwitch';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import ModalFooter from './ModalFooter';

import styles from './newContactModalStyles';

const validate = values => {
    const errors = {};

    if (path(['contactPhone', 'length'], values) && !PHONE_REGEXP.test(values.contactPhone)) {
        errors.contactPhone = PHONE_VALIDATION_ERR;
    }

    return errors;
};

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('forms.errorInputRequired'),
    sex: Yup.string().required(),
    email: Yup.string().email('forms.errorEmailValidation'),
    personalEmail: Yup.string().email('forms.errorEmailValidation'),
    socialNetwork: Yup.string().url('forms.errorUrlValidation'),
    countryId: Yup.number().required('forms.errorInputRequired'),
});

type Props = FormikProps & {
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    createOneContact: Function,
    handlerOpenOrCloseModal: Function,
    isCloseModal: boolean,
    idCompany: string;
    classes: Object,
    isModalShow: boolean,
    status: string,
    closeModal: () => void,
    resetForm: () => void,
    setSendRequest: () => void,
    sendRequest: boolean,
    userRoles?: Array<string>,
    applyId: number,
    user: { username: string, roles: Array<string> },
    setFieldTouched: (name: string, param: string | Object) => void,
    saleMainContact: { firstName: string, lastName: string },
    saleId: number,
};

const NewContactModal = ({
    values,
    handleChange,
    sendRequest,
    setSendRequest,
    handlerOpenOrCloseModal,
    handleReset,
    handleSubmit,
    isModalShow,
    errors,
    touched,
    classes,
    user,
    setFieldTouched,
    saleMainContact,
}: Props) => {
    const [valuesFromRequest, setValues] = useState({});
    const [confirmationDialog, toggleConfirmationDialog] = useState(false);

    const translations = {
        addContact: useTranslation('sale.contactSection.addContact.addContact'),
        madeMainContact: useTranslation('sale.contactSection.addContact.madeMainContact'),
        mainContact: useTranslation('sale.contactSection.addContact.mainContact'),
        willBeReplacedBy: useTranslation('sale.contactSection.addContact.willBeReplacedBy'),
    };

    const handleToggleModal = () => {
        toggleConfirmationDialog(!confirmationDialog);
        handleReset();
        handlerOpenOrCloseModal();
    };

    const handleBlur = (name: string) => () => setFieldTouched(name, true);

    const fetchValues = async () => {
        const { username } = user;

        const countriesPromise = getCountry();
        const socialContactsPromise = getAuthUserSocialContacts({ username });

        const [countries, socialContacts] = await Promise.all([
            countriesPromise,
            socialContactsPromise,
        ]);

        const sortedCountries = sortBy(({ name }) => name, countries);
        const countriesSuggestions = sortedCountries.map(({ name, id }) => ({ label: name, value: id })) || [];

        const socialContactsSuggestions = socialContacts.content.map(
            ({ socialNetworkUser: { name, id }, source: { name: sourceName } }) => (
                { label: `${name} - ${sourceName}`, value: id }
            )
        );
        const socialContactsUnique = uniqBy(({ label }) => label, socialContactsSuggestions);

        const countryId = countriesSuggestions.find(({ value }) => value === values.countryId) || '';

        setValues({
            countriesSuggestions,
            countryId,
            socialContactsSuggestions: socialContactsUnique,
        });
    };

    const handleChangeFields = (fieldName, value) => {
        const changeField = handleChange(fieldName);
        const changeMainContact = handleChange('mainContact');

        if (fieldName === 'firstName' && !value) {
            changeMainContact(false);
        }

        changeField && changeField({ target: { value } });
    };

    const handleChangeMainContact = () => {
        const changeMainContact = handleChange('mainContact');

        changeMainContact && changeMainContact(!values.mainContact);
    };

    return (
        <Dialog
            scroll='body'
            open={isModalShow}
            onClose={() => toggleConfirmationDialog(!confirmationDialog)}
            classes={{ paper: classes.paperContainer }}
            PaperProps={{
                classes: { rounded: classes.root },
            }}
        >
            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
            >
                <Grid
                    item container
                    justify='space-between'
                    xs={12}
                >
                    <Grid item>
                        <DialogTitle
                            className={classes.title}
                            disableTypography
                        >
                            {translations.addContact}
                        </DialogTitle>
                    </Grid>
                    <Grid item>
                        <IconButton
                            className={classes.exitButton}
                            onClick={() => toggleConfirmationDialog(!confirmationDialog)}
                        >
                            <CRMIcon IconComponent={Clear} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    direction='row'
                    justify='space-evenly'
                    alignItems='center'
                    xs={12}
                >
                    <form onSubmit={handleSubmit}>
                        <NewContactForm
                            values={values}
                            valuesFromRequest={valuesFromRequest}
                            fetchValues={fetchValues}
                            onHandleChange={handleChangeFields}
                            onHandleBlur={handleBlur}
                            errors={errors}
                            touched={touched}
                            alignItemForGrid='flex-start'
                        />
                        <Grid
                            item
                            className={classes.field}
                        >
                            <FormControlLabel
                                value='mainContact'
                                control={<CRMSwitch
                                    checked={values.mainContact}
                                    onChange={handleChangeMainContact}
                                    disabled={!values.firstName}
                                />}
                                label={translations.madeMainContact}
                                labelPlacement='end'
                                classes={{ label: classes.switchLabel }}
                            />
                        </Grid>
                        {saleMainContact && values.mainContact && values.firstName
                            && <Grid className={classes.warning}>
                                {`${translations.mainContact} ${saleMainContact.firstName} ${saleMainContact.lastName}
                                 ${translations.willBeReplacedBy} ${values.firstName} ${values.lastName}`}
                            </Grid>
                        }
                        <ModalFooter
                            sendRequest={sendRequest}
                            setSendRequest={setSendRequest}
                            handleToggleModal={handleToggleModal}
                            confirmationDialog={confirmationDialog}
                            toggleConfirmationDialog={toggleConfirmationDialog}
                        />
                    </form>
                </Grid>
            </Grid>
        </Dialog>
    );
};

const StyledModal = withStyles(styles)(connect(
    ({ session }) => ({ user: session.userData })
)(NewContactModal));

export default withFormik({
    mapPropsToValues: () => ({
        contactPhone: '',
        countryId: '',
        email: '',
        firstName: '',
        lastName: '',
        personalEmail: '',
        position: '',
        skype: '',
        socialNetworkUserId: '',
        socialNetwork: '',
        sex: MALE_KEY,
        mainContact: false,
        dateOfBirth: null,
    }),
    isInitialValid: false,
    handleSubmit: ({
        contactPhone,
        countryId,
        email,
        firstName,
        lastName,
        personalEmail,
        position,
        skype,
        socialNetworkUserId,
        socialNetwork,
        sex,
        mainContact,
        dateOfBirth,
    }, { props, resetForm }) => {
        const {
            idCompany,
            createOneContact,
            closeModal,
            saleId,
        } = props;

        const newValues = {
            countryId: getValueOrNull(countryId),
            firstName,
            socialNetworkUserId: getValueOrNull(socialNetworkUserId),
            contactPhone: getValueOrNull(contactPhone),
            email: getValueOrNull(email),
            lastName: getValueOrNull(lastName),
            personalEmail: getValueOrNull(personalEmail),
            position: getValueOrNull(position),
            skype: getValueOrNull(skype),
            socialNetwork: getValueOrNull(socialNetwork),
            sex,
            companyId: idCompany,
            mainContact,
            saleId,
            dateOfBirth: getDate(dateOfBirth, FULL_DATE_DS) || '',
        };

        createOneContact(newValues);
        resetForm();
        closeModal();
    },
    validate,
    validationSchema,
})(StyledModal);
