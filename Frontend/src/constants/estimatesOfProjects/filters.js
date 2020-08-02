// @flow

import type { Select } from '../../stores/Store.flow';

const status: Array<Select> = [
    {
        value: '',
        title: 'Все',
    },
    {
        value: 'New',
        title: 'New',
    },
    {
        value: 'In Progress',
        title: 'In Progress',
    },
    {
        value: 'Approve need',
        title: 'Approve need',
    },
    {
        value: 'Done',
        title: 'Done',
    },
];

export const queriesMenuItems: Array<{value: string | boolean, title: string}> = [
    {
        value: '',
        title: 'Все',
    },
    {
        value: true,
        title: 'Активные',
    },
    {
        value: false,
        title: 'Отложенные',
    },
];

export const statusMenuItems: Array<Select> = [...status];
