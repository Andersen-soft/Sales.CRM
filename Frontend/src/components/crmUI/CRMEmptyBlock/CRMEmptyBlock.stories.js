// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import CRMEmptyBlock from './CRMEmptyBlock';

storiesOf('Molecules/CRMEmptyBlock', module)
    .add('CRM Empty Block text', () => (
        <CRMEmptyBlock
            text='Отсутствует Активность'
        />
    ));
