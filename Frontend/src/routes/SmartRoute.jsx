// @flow
import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { intersection, isEmpty, equals } from 'ramda';

import Basis from 'crm-components/common/Basis';
import AccessDenied from 'crm-components/common/AccessDenied';
import { pages } from 'crm-constants/navigation';
import auth from 'crm-helpers/auth';
import type { Location } from 'crm-types/location';
import { setPreviousPath } from 'crm-actions/authActions';
import EventEmitter from 'crm-helpers/eventEmitter';
import { Helmet } from 'react-helmet';

import type { RouteConf } from './routesConfig';
import type { UserSessionData } from '../stores/session';

type SyncActionResultType = { type: string, payload: string | null };

type Props = RouteConf & {
    user: ?UserSessionData,
    location: Location,
    setPreviousPath: (string | null) => SyncActionResultType,
};

type State = {
    authenticationError: boolean,
}

// TODO: удалить (Helmet) после реализации мобильной версиии системы
// добавлять в массив страницы для которых реализована мобильная версия

const mobilePageList = ['/desktop', '/login', '/express-sale', '/resume-requests/:resumeId', '/mail-express-sale'];

class SmartRoute extends PureComponent<Props, State> {
    state = { authenticationError: false };

    componentDidMount() {
        const {
            location: { pathname },
            setPreviousPath: setPath,
        } = this.props;

        EventEmitter.on('unauthorized', () => {
            this.setState({ authenticationError: true });
        });

        EventEmitter.on('authorized', () => {
            this.setState({ authenticationError: false });
        });

        if (pathname && !equals(pathname, pages.LOGIN)) {
            setPath(pathname);
        }
    }

    componentWillUnmount() {
        EventEmitter.off('unauthorized');
        EventEmitter.off('authorized');
    }


    render() {
        const {
            user,
            component: Component,
            allowedRoles = [],
            isPublic,
            ...rest
        } = this.props;
        const { authenticationError } = this.state;

        return (
            <>
                <Helmet>
                    { mobilePageList.includes(rest.path)
                        ? <meta name='viewport' content='width=device-width, initial-scale=1 maximum-scale=1' />
                        : <meta name='viewport' content='width=1360' />
                    }
                </Helmet>
                <Route
                    {...rest}
                    exact
                    render={props => {
                        if (isPublic) {
                            return <Component {...props} />;
                        }

                        if (!(auth.checkAuth() && user && user.roles.length) || authenticationError) {
                            return (
                                <Redirect
                                    to={{
                                        pathname: pages.LOGIN,
                                        state: { from: props.location },
                                    }}
                                />
                            );
                        }

                        if (isEmpty(intersection(allowedRoles, user.roles))) {
                            return (
                                <Basis {...props} userRole={user.roles} userId={user.id}>
                                    <AccessDenied />
                                </Basis>
                            );
                        }

                        return (
                            <Basis userRole={user.roles} userId={user.id}>
                                <Component {...props} routeParams={props.match.params} />
                            </Basis>
                        );
                    }}
                />
            </>
        );
    }
}

export default connect(
    state => ({ user: state.session.userData }), {
        setPreviousPath,
    }
)(SmartRoute);
