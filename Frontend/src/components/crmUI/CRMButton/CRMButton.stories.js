// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import CRMButton from './CRMButton';

storiesOf('Molecules/CRMButton', module)
    .add('CRM Button', () => (
        <CRMButton>
            + Активность
        </CRMButton>
    ))
    .add('CRM Button disable', () => (
        <CRMButton
            disabled
        >
            Войти
        </CRMButton>
    ))
    .add('CRM Button big', () => (
        <CRMButton
            size='large'
        >
            Войти
        </CRMButton>
    ))
    .add('CRM Button full width', () => (
        <CRMButton
            fullWidth
        >
            Войти
        </CRMButton>
    ))
    .add('CRM Button grey styled', () => (
        <CRMButton
            grey
        >
            Добавить
        </CRMButton>
    ))
    .add('CRM Button action', () => (
        <CRMButton
            variant='action'
        >
            Заменить
        </CRMButton>
    ));
