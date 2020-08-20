// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CRMPagination from './CRMPagination';

storiesOf('Molecules/CRMPagination', module)
    .add('CRM Pagination', () => (
        <CRMPagination
            rowsPerPage={10}
            count={1400}
            onChangePage={action('onChangePage')}
        />
    ))
    .add('CRM pagination set page', () => (
        <CRMPagination
            rowsPerPage={10}
            count={1400}
            page={4}
            onChangePage={action('onChangePage')}
        />
    ));
