// @flow

import React, {
    useContext,
    useEffect,
    useState,
} from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import LoginForm from 'crm-components/Login/LoginForm/LoginForm';
import ChangePasswordForm from 'crm-components/Login/ChangePasswordForm/ChangePasswordForm';
import { login, setPreviousPath } from 'crm-actions/authActions';
import { checkToken, changePassword } from 'crm-api/login/loginService';
import auth from 'crm-helpers/auth';
import { getDefaultPage } from 'crm-helpers/navigation';
import { isNil, pathOr } from 'ramda';
import EventEmitter from 'crm-helpers/eventEmitter';
import CompanyLogo from 'crm-static/logo-text.svg';
import Notification from 'crm-components/notification/NotificationSingleton';
import { useTranslation } from 'crm-hooks/useTranslation';
import { IsLanguageContext } from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';

import type { UserSessionData } from 'crm-stores/session';
import type { Location } from 'crm-types/location';

import styles from './LoginPageStyles';

type SyncActionResultType = { type: string, payload: string | null };
type AuthDataType = { username: string, password: string };
type ChangePasswordType = { password: string, repeatPassword: string }

type Props = {
    user: UserSessionData | null,
    prevPath: string | null,
    handleLogin: (AuthDataType) => void,
    setPath: (path: string | null) => SyncActionResultType,
    classes: Object,
    location: Location,
};

const KEY_NAME = 'k';

const LoginContainer = ({
    user,
    prevPath,
    handleLogin,
    setPath,
    classes,
    location,
}: Props) => {
    const [checkTokenResult, setCheckTokenResult] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const { locale, switchLanguage } = useContext(IsLanguageContext);

    const translations = {
        title: useTranslation('loginPage.title'),
        changePasswordSuccess: useTranslation('loginPage.changePasswordSuccess'),
        changePasswordError: useTranslation('loginPage.changePasswordError'),
        andersenLogo: useTranslation('loginPage.andersenLogo'),
    };

    const verificationToken = async tokenId => {
        try {
            const result = await checkToken(tokenId);

            setCheckTokenResult(result);
        } catch (error) {
            setErrorMessage(pathOr('', ['response', 'data', 'errorMessage'], error));
            auth.eraseSessionData();
        }
    };

    const getTokenId = () => {
        const parsedQueryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

        return parsedQueryParams[KEY_NAME];
    };

    useEffect(() => {
        document.title = translations.title;

        const tokenId = getTokenId();

        tokenId && verificationToken(tokenId);
    }, []);

    const onLogin = async (values: AuthDataType) => {
        const registeredUser = await handleLogin(values);

        EventEmitter.emit('authorized');

        if (registeredUser && registeredUser.id) {
            const DEFAULT_ROUTE = getDefaultPage(registeredUser.roles);

            const getRedirectPath = path => {
                if (auth.isPrevUserDataAvailable() && !auth.isUserSameAsPrev()) {
                    return DEFAULT_ROUTE;
                }

                return path;
            };

            const redirectLink = isNil(prevPath)
                ? DEFAULT_ROUTE
                : getRedirectPath(prevPath);

            if (redirectLink) {
                setPath(redirectLink);
            }

            if (registeredUser.employeeLang) {
                registeredUser.employeeLang !== locale && switchLanguage();
            }
        }
    };

    const handleChangePassword = async ({ password }: ChangePasswordType) => {
        try {
            const { login: username, token } = checkTokenResult;
            const tokenKey = getTokenId();

            auth.saveAccessToken(token);
            await changePassword(username, password, token, tokenKey);

            Notification.showMessage({
                message: translations.changePasswordSuccess,
                type: 'success',
                closeTimeout: 15000,
            });

            onLogin({ username, password });
        } catch (error) {
            Notification.showMessage({
                message: translations.changePasswordError,
                type: 'error',
                closeTimeout: 15000,
            });

            auth.eraseSessionData();
            EventEmitter.emit('unauthorized');
        }
    };

    const isAllowRedirect = auth.checkAuth() && user && prevPath;
    const userLogin = pathOr(null, ['login'], checkTokenResult);

    return isAllowRedirect ? (
        <Redirect to={prevPath} />
    ) : (
        <Grid
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
                    alt={translations.andersenLogo}
                />
            </Grid>
            <Grid
                container
                item
                justify='center'
                alignItems='center'
                className={classes.formBlock}
            >
                {!getTokenId()
                    ? <LoginForm onLogin={onLogin} />
                    : <ChangePasswordForm
                        userLogin={userLogin}
                        errorMessage={errorMessage}
                        onChangePassword={handleChangePassword}
                    />
                }
            </Grid>
        </Grid>
    );
};

const StyledLoginContainer = withStyles(styles)(LoginContainer);

export default connect(
    state => ({
        user: state.session.userData,
        prevPath: state.session.prevPath,
    }),
    {
        handleLogin: login,
        setPath: setPreviousPath,
    },
)(StyledLoginContainer);
