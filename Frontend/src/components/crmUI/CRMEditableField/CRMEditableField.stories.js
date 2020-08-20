// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CRMEditableField from './CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';

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

storiesOf('CRMEditableField', module)
    .add('CRMEditableField Select', () => (
        <CRMEditableField
            onTextClick={action('onTextClick')}
            component={CRMAutocompleteSelect}
            componentType='select'
            componentProps={{
                value,
                componentType: 'select',
                options: mockEmployee,
                onChange: action('onChange'),
                autoFocus: true,
                menuIsOpen: true,
            }}
        />
    ));
