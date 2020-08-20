// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import { BrowserRouter } from 'react-router-dom';
import CRMSocialNetworkIconLink from './CRMSocialNetworkIconLink';

storiesOf('Molecules/CRMSocialNetworkIconLink', module)
    .add('Icons', () => (
        <BrowserRouter>
            <div>
                <CRMSocialNetworkIconLink
                    link='https://www.linkedin.com/in/123/'
                />
                <CRMSocialNetworkIconLink
                    link='https://jira.com/browse/123'
                />
                <CRMSocialNetworkIconLink
                    link='https://ooooo.com/browse/123'
                />
            </div>
        </BrowserRouter>));
