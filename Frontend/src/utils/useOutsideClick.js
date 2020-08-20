// @flow

import React, { useEffect } from 'react';
import { propOr } from 'ramda';

export type OutsideClickConfigType = {
    onClick: (event: MouseEvent) => any,
    onClickCustom?: (event: MouseEvent) => void,
    elementRefs: Array<*>,
    checkIfElementsExists?: boolean,
};

const checkContainsAccessible = (element: Object) => element && Boolean(element.contains);
const gerCurrent = propOr(null, 'current');

const useOutsideClick = (
    {
        onClick,
        onClickCustom,
        elementRefs = [],
        checkIfElementsExists = true,
    }: OutsideClickConfigType,
    deps: Array<*> = [],
) => {
    const handleClick = (event: MouseEvent) => {
        const { target } = event;

        const allElementsExists = elementRefs
            .map(gerCurrent)
            .every(checkContainsAccessible);
        const targetNotContained = elementRefs
            .map(gerCurrent)
            .filter(checkContainsAccessible)
            .every((element: Object) => !element.contains(target));

        if (
            (!checkIfElementsExists || allElementsExists)
            && targetNotContained
        ) {
            onClick(event);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', onClickCustom || handleClick);

        return () => document.removeEventListener(
            'mousedown',
            onClickCustom || handleClick,
        );
    }, [elementRefs, ...deps]);
};

export default useOutsideClick;
