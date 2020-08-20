// @flow

import React, { useState, useEffect } from 'react';
import { Grid, Dialog, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import CRMLink from 'crm-ui/CRMLink/CRMLink';
import { sortBy } from 'ramda';
import * as Yup from 'yup';
import CompanyLogo from 'crm-static/logo-text.svg';
import { INPUT_REQUIRED_ERR_KEY, EMAIL_VALIDATION_ERR_KEY } from 'crm-constants/forms';
import Notification from 'crm-components/notification/NotificationSingleton';
import { PHONE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import { getCountry } from 'crm-api/contactsCard/contactsCardService';
import { createExpressSale } from 'crm-api/ExpressSale/ExpressSale';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';
import ExpressForm from './ExpressForm';

import type { FormikProps } from 'crm-types/formik';

import styles from 'crm-components/common/ExpressSaleFormStyles/ExpressSaleFormStyles';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(EMAIL_VALIDATION_ERR_KEY)
        .test('is-required-phone',
            INPUT_REQUIRED_ERR_KEY,
            function test(email) { return !!email || !!this.parent.phone; }),
    phone: Yup.string()
        .test('is-required-email',
            INPUT_REQUIRED_ERR_KEY,
            function test(phone) { return !!phone || !!this.parent.email; }),
    country: Yup.object().shape({
        label: Yup.string(),
        value: Yup.number(),
    }).nullable().required(INPUT_REQUIRED_ERR_KEY),
});

type Props = {
    classes: Object,
    status?: any,
} & FormikProps;

const CREATE = 'create';

const ExpressSaleForm = ({
    classes,
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    status,
    handleReset,
    validateForm,
}: Props) => {
    const [countriesSuggestions, setCountriesSuggestions] = useState([]);
    const [loadCountry, setLoadCountry] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const translations = {
        errorsMessage: useTranslation('expressSale.errorsMessage'),
        sale: useTranslation('expressSale.sale'),
        created: useTranslation('expressSale.created'),
        repeatedData: useTranslation('expressSale.repeatedData'),
        continue: useTranslation('expressSale.continue'),
    };

    useEffect(() => {
        (async () => {
            setLoadCountry(true);

            try {
                const countries = await getCountry();
                const sortedCountries = sortBy(({ name }) => name, countries);
                const suggestions = sortedCountries.map(({ name, id }) => ({ label: name, value: id })) || [];

                setLoadCountry(false);
                setCountriesSuggestions(suggestions);
            } catch {
                setLoadCountry(false);
            }
        })();
    }, []);

    useEffect(() => {
        Notification.closeMessage();

        if (Object.keys(touched).length && Object.keys(errors).length) {
            Notification.showMessage({
                message: translations.errorsMessage,
                isTimerDisabled: true,
                isHidenIcon: true,
            });
        }
    }, [touched, errors]);

    useEffect(() => {
        if (status.type) {
            setShowModal(true);
            setLoading(false);
        }
    }, [status]);

    const handleContinue = () => {
        handleReset();
        setShowModal(false);
    };

    const changePhone = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const { target: { value } } = event;

        if (PHONE_REGEXP.test(value) || !value.length) {
            const handlePhoneChange = handleChange('phone');

            handlePhoneChange && handlePhoneChange(event);
        }
    };

    const submit = event => {
        event.persist();

        validateForm().then(formErrors => {
            if (!Object.keys(formErrors).length) {
                setLoading(true);
            }
            handleSubmit(event);
        });
    };

    return <Grid
        className={classes.wrapper}
        container
        direction='column'
        justify='flex-start'
        alignItems='center'
    >
        <Grid
            container
            item
            justify='center'
            alignItems='flex-end'
            className={classes.logoBlock}
        >
            <CompanyLogo
                preserveAspectRatio='none'
                viewBox='0 0 140 43'
                className={classes.logo}
                alt='Логотип Андерсен'
            />
        </Grid>
        <Grid
            container
            item
            justify='center'
            alignItems='center'
            className={classes.formBlock}
        >
            <form onSubmit={submit}>
                <ExpressForm
                    classes={classes}
                    countriesSuggestions={countriesSuggestions}
                    loadCountry={loadCountry}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    errors={errors}
                    touched={touched}
                    loading={loading}
                    setLoading={setLoading}
                    handleSubmit={handleSubmit}
                    changePhone={changePhone}
                />
            </form>
        </Grid>
        <Dialog
            disableRestoreFocus
            open={showModal}
            onClose={handleContinue}
            classes={{ paper: classes.dialogContainer }}
        >
            <Typography className={classes.message}>
                {status
                    && (status.type === CREATE
                        ? <>
                            {translations.sale}
                            <CRMLink
                                to={`${pages.SALES_FUNNEL}/${status.sales[0].id}`}
                                className={classes.link}
                            >
                                {` ${status.sales[0].companyName} `}
                            </CRMLink>
                            {translations.created}
                        </>
                        : <>
                            {translations.repeatedData}
                            {status.sales && status.sales.map(({ id, companyName }, index, arr) => <CRMLink
                                key={id}
                                to={`${pages.SALES_FUNNEL}/${id}`}
                                className={classes.link}
                            >
                                {` ${companyName}`}
                                {index + 1 !== arr.length ? ',' : '. '}
                            </CRMLink>)}
                        </>)
                }
            </Typography>
            <CRMButton
                className={classes.button}
                onClick={handleContinue}
                primary
                size='large'
            >
                {translations.continue}
            </CRMButton>
        </Dialog>
    </Grid>;
};

const StyledForm = withStyles(styles)(ExpressSaleForm);

export default withFormik({
    mapPropsToValues: () => ({
        name: '',
        email: '',
        phone: '',
        country: null,
        comment: '',
    }),
    mapPropsToStatus: () => ({}),
    handleSubmit: (values, { setStatus }) => {
        createExpressSale(values)
            .then(response => setStatus(response));
    },
    validationSchema,
})(StyledForm);
