// @flow

import { storiesOf } from '@storybook/react';
import React from 'react';

import CRMCheckboxesGroup, {
    type ILabeledCheckbox,
} from 'crm-components/common/CRMCheckboxesGroup/CRMCheckboxesGroup';

const mockCheckboxes: Array<ILabeledCheckbox> = [
    {
        key: 1,
        label: 'string1',
        value: 'string1',
        checked: true,
    },
    {
        key: 2,
        label: 'string2',
        value: 'string2',
        checked: true,
    },
    {
        key: 2,
        label: 'string3',
        value: 'string3',
        checked: false,
    },
];

storiesOf('Checkboxes', module).add('Checkboxes Demo', () => <CRMCheckboxesGroup labeledCheckboxes={mockCheckboxes} />);
