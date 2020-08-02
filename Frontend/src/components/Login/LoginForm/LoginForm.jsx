// @flow
import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMPasswordInput from 'crm-ui/CRMInput/CRMPasswordInput';
import {
    USERNAME_REQUIRED_ERR,
    PASS_REQUIRED_ERR,
    PASS_MIN_ERR,
    PASS_MIN_LENGTH,
} from 'crm-constants/forms';
import type { FormikProps } from 'crm-types/formik';

import styles from './LoginStyles';

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required(USERNAME_REQUIRED_ERR),
    password: Yup.string()
        .min(PASS_MIN_LENGTH, PASS_MIN_ERR)
        .required(PASS_REQUIRED_ERR),
});

type Props = FormikProps & {
    onLogin: Function,
    classes: Object,
}

const LoginForm = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    classes,
}: Props) => {
    const translations = {
        header: useTranslation('loginForm.header'),
        login: useTranslation('loginForm.login'),
        loginEnter: useTranslation('loginForm.loginEnter'),
        password: useTranslation('loginForm.password'),
        passwordEnter: useTranslation('loginForm.passwordEnter'),
        logIn: useTranslation('loginForm.logIn'),
    };

    return (<Grid className={classes.paper}>
        <Typography className={classes.title} variant='h1'>
            {translations.header}
        </Typography>
        <form onSubmit={handleSubmit}>
            <Typography className={classes.inputLabel} variant='body2'>
                {translations.login}
            </Typography>
            <CRMInput
                autoComplete='login'
                className={classes.inputWrapper}
                placeholder={translations.loginEnter}
                name='username'
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={touched.username && errors.username}
            />
            <Typography className={classes.inputLabel} variant='body2'>
                {translations.password}
            </Typography>
            <CRMPasswordInput
                autoComplete='password'
                className={classes.inputWrapper}
                placeholder={translations.passwordEnter}
                name='password'
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && errors.password}
            />
            <CRMButton
                type='submit'
                disabled={!isValid}
                variant='action'
                className={classes.buttonWrapper}
                size='large'
            >
                {translations.logIn}
            </CRMButton>
        </form>
    </Grid>);
};

const StyledLogin = withStyles(styles)(LoginForm);

export default withFormik({
    mapPropsToValues: () => ({ username: '', password: '' }),
    isInitialValid: false,
    handleSubmit: (values, { props }) => { props.onLogin(values); },
    validationSchema,
})(StyledLogin);
