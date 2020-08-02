// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';

import { BrowserRouter } from 'react-router-dom';
import FooterMobile from './FooterMobile';
import configureStore from 'crm-stores/configureStore';

const store = configureStore();

storiesOf('Molecules/FooterMobile', module)
    .add('FooterMobile', () => (
        <Provider store={store}>
            <BrowserRouter>
                <FooterMobile
                    userRole={['ROLE_SALES']}
                />
            </BrowserRouter>
        </Provider>
    ));
