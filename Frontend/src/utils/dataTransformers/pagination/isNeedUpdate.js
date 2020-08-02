// @flow

import {
    equals,
    isNil,
} from 'ramda';
import { toInnerNumiration } from 'crm-utils/dataTransformers/pagination';

const totalElementsCheck = (
    userPage: string,
    prevCount: number,
    nextCount: number,
) => isNil(userPage) || isNil(prevCount) || !equals(prevCount, nextCount);

const nextPageCheck = (
    nextPage: number,
    userPage: string,
    isEditable: boolean
) => (nextPage !== (toInnerNumiration(+userPage))) && !isEditable;

export {
    totalElementsCheck,
    nextPageCheck,
};
