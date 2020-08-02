// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CRMAutocompleteSelect from './CRMAutocompleteSelect';

const mockEmployee = [
    { label: 'Иван Иванов', value: 1 },
    { label: 'Иван Иванов', value: 2 },
    { label: 'Иван Иванов', value: 3 },
    { label: 'Иван Иванов', value: 4 },
    { label: 'Иван Иванов', value: 5 },
    { label: 'Иван Иванов', value: 6 },
    { label: 'Иван Иванов', value: 7 },
    { label: 'Иван Иванов', value: 8 },
    { label: 'Иван Иванов', value: 9 },
    { label: 'Иван Иванов', value: 10 },
    { label: 'Иван Иванов', value: 11 },
    { label: 'Иван Иванов', value: 12 },
    { label: 'Иван Иванов', value: 13 },
];
const value = mockEmployee[1];

storiesOf('Molecules/CRMAutocompleteSelect', module)
    .add('CRM Autocoplete Select controlled', () => (
        <CRMAutocompleteSelect
            value={value}
            options={mockEmployee}
            controlled
            onChange={action('onChange')}
        />
    ))
    .add('CRM Autocoplete Select empty', () => (
        <CRMAutocompleteSelect
            value={null}
            options={[]}
            onChange={action('onChange')}
        />
    ))
    .add('CRM Autocoplete Select unControlled', () => (
        <CRMAutocompleteSelect
            value={value}
            options={mockEmployee}
            onChange={action('onChange')}
        />
    ));
