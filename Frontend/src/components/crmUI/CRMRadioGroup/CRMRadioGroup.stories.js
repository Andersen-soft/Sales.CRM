// @flow

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import CRMRadioGroup from './CRMRadioGroup';

const mockData = [
    { value: 'first', label: '1th section', icon: true },
    { value: 'second', label: '2th section' },
    { value: 'third', label: '3th section', icon: false },
];

const CRMRadioGroupComponent = () => {
    const [value, setValue] = useState('first');

    const handleRadioChange = event => {
        setValue(event.target.value);
    };

    return (
        <CRMRadioGroup
            value={value}
            content={mockData}
            handleRadioChange={handleRadioChange}
            labelHeader={'Текст заголовка'}
        />
    );
};

storiesOf('Molecules/CRMRadioGroup', module)
    .add('CRMRadioGroup', () => (
        <CRMRadioGroupComponent />
    ));
