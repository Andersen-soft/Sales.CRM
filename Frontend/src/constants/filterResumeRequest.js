// @flow

import type { Select } from '../stores/Store.flow';

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

export const statusMenuItems: Array<Select> = [
    {
        value: '',
        title: 'Все',
    },
    {
        value: 'Name need',
        title: 'Name need',
    },
    {
        value: 'In progress',
        title: 'In Progress',
    },

    {
        value: 'Done',
        title: 'Done',
    },
];

export const priorityMenuItems: Array<Select> = [
    {
        value: 'all',
        title: 'Все',
    },
    {
        value: 'important',
        title: 'Очень важный',
    },
    {
        value: 'normal',
        title: 'Обычный',
    },
    {
        value: 'notImportant',
        title: 'Не важный',
    },
];

export const responsibleRMMenuItems: Array<Select> = [
    {
        value: 'all',
        title: 'Все',
    },
    {
        value: 'vitaly',
        title: 'Василенко Виталий',
    },
    {
        value: 'sergey',
        title: 'Гавага Сергей',
    },
];

export const responsibleForRequestMenuItems: Array<Select> = [
    {
        value: 'all',
        title: 'Все',
    },
    {
        value: 'else',
        title: '...',
    },
];

export const resumeStatusMenuItems: Array<Select> = [
    {
        value: '',
        title: 'Все',
    },
    {
        value: 'hr need',
        title: 'HR need',
    },
    {
        value: 'Name need',
        title: 'Name need',
    },
    {
        value: 'In progress',
        title: 'In Progress',
    },
    {
        value: 'rm need',
        title: 'RM need',
    },
    {
        value: 'Done',
        title: 'Done',
    },
];
