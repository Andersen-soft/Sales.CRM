// @flow

import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMPasswordInput from 'crm-ui/CRMInput/CRMPasswordInput';
import {
    PASS_REQUIRED_ERR,
    PASS_MATCHING_ERR,
    PASS_ERR,
} from 'crm-constants/forms';
import { PASSWORD_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import type { FormikProps } from 'crm-types/formik';

import styles from './ChangePasswordFormStyles';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .matches(PASSWORD_REGEXP, {
            message: PASS_ERR,
            excludeEmptyString: true,
        })
        .required(PASS_REQUIRED_ERR),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('password')], PASS_MATCHING_ERR)
        .required(PASS_REQUIRED_ERR),
});

type Props = FormikProps & {
    onChangePassword: () => void,
    classes: Object,
    userLogin: string,
    errorMessage: string,
}

const ChangePasswordForm = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    classes,
    userLogin,
    errorMessage,
}: Props) => {
    const renderForm = () => (<Grid className={classes.paper}>
        <Typography
            className={classes.title}
            variant='h1'
        >
            Установите пароль для учётной записи
        </Typography>
        <Typography className={classes.login}>
            Ваш логин: <span className={classes.name}>{userLogin}</span>
        </Typography>
        <form onSubmit={handleSubmit}>
            <Typography
                className={classes.inputLabel}
                variant='body2'
            >
                Пароль:
            </Typography>
            <CRMPasswordInput
                className={classes.inputWrapper}
                placeholder='Придумайте пароль'
                name='password'
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && errors.password}
            />
            <Typography
                className={classes.inputLabel}
                variant='body2'
            >
                Подтверждение:
            </Typography>
            <CRMPasswordInput
                className={classes.inputWrapper}
                placeholder='Подтвердите пароль'
                name='repeatPassword'
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.repeatPassword}
                error={touched.repeatPassword && errors.repeatPassword}
            />
            <Typography
                className={classes.inputLabel}
                variant='body2'
            >
                Длина пароля должна быть от 6 до 12 символов. Пароль должен состоять из букв
                латинского алфавита в разном регистре (A-z) и арабских цифр (0-9).
            </Typography>
            <CRMButton
                type='submit'
                disabled={!isValid}
                variant='action'
                fullWidth
                className={classes.buttonWrapper}
                size='large'
            >
                Продолжить
            </CRMButton>
        </form>
    </Grid>);

    const renderErrorOrLoader = () => !errorMessage
        ? <CRMLoader />
        : (<Grid className={classes.paper}>
            <Typography className={classes.error}>
                {errorMessage}
            </Typography>
        </Grid>);


    return !userLogin
        ? renderErrorOrLoader()
        : renderForm();
};

const StyledChangePasswordForm = withStyles(styles)(ChangePasswordForm);

export default withFormik({
    mapPropsToValues: () => ({ password: '', repeatPassword: '' }),
    isInitialValid: false,
    handleSubmit: (values, { props }) => { props.onChangePassword(values); },
    validationSchema,
})(StyledChangePasswordForm);
