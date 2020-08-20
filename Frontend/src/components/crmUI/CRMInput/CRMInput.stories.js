// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CRMInput from './CRMInput';
import CRMPasswordInput from './CRMPasswordInput';

storiesOf('Molecules/CRMInput', module)
    .add('CRM Input', () => (
        <CRMInput
            value='текст'
            label='Имя'
        />
    ))
    .add('CRM Input label', () => (
        <CRMInput
            placeholder='Введите имя'
        />
    ))
    .add('CRM Input disable', () => (
        <CRMInput
            disabled
        />
    ))
    .add('CRM Input error', () => (
        <CRMInput
            error='Обязательное поле'
        />
    ))
    .add('CRM Input canceleble', () => (
        <CRMInput
            clearable
            onClear={action('clear')}
        />
    ))
    .add('CRM Input search', () => (
        <CRMInput
            searchable
            onChange={action('search')}
            onClear={action('clear')}
        />
    ))
    .add('CRM Input password', () => (
        <CRMPasswordInput
            onChange={action('change')}
        />
    ));
