// @flow

import { invertObj } from 'ramda';

export const PRIORITY_OBJ = {
    normal: 'Обычный',
    high: 'Очень Важный',
    low: 'Не важный',
};

export const PRIORITY_ARR = Object.entries(PRIORITY_OBJ);

export const PRIORITIES_ENG = invertObj(PRIORITY_OBJ);
