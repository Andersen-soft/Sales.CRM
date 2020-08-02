// @flow

import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import BasisSubscription from 'crm-components/common/BasisSubscription/BasisSubscription';
import SmartRoute from '../routes/SmartRoute';
import routesConfig from '../routes/routesConfig';

import '../styles/index.css';
import '../styles/vars.css';
import '../styles/scrollbar.css';

const App = () => (
    <BasisSubscription>
        <BrowserRouter>
            <Switch>
                {routesConfig.map(routeSettings => (
                    <SmartRoute {...routeSettings} key={routeSettings.path} />
                ))}
            </Switch>
        </BrowserRouter>
    </BasisSubscription>
);

export default App;
