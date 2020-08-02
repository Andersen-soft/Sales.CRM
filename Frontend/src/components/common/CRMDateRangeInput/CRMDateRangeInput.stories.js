import { storiesOf } from '@storybook/react';
import React from 'react';

import CRMDateRangeInput from './CRMDateRangeInput';

storiesOf('Data ranges, pickers', module)
    .add('Date range Input', () => (
        <div>
            <h2>без дат, по умолчанию</h2>
            <CRMDateRangeInput onSelectRange={() => {}}/>
            <h2>сегодня -- не выбрано</h2>
            <CRMDateRangeInput onSelectRange={() => {}} startDate={new Date()}/>
            <h2>не выбранно -- сегодня</h2>
            <CRMDateRangeInput onSelectRange={() => {}} startDate={new Date()} maxDate={new Date()}/>
        </div>
    ));
