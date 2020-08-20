import React from 'react';

/*
    оригинальная либа https://www.npmjs.com/package/is-react
    можно использовать дял определения является ли обьект реакт элементо, компонентом
    и каким типом компонента является
    может быть полезно при разработки реюзабельных компонентов
 */

const FUNCTION_REGEX = /react(\d+)?./i;

export const isClassComponent = component => (
    typeof component === 'function'
    && component.prototype
    && !!component.prototype.isReactComponent
);

// Ensure compatability with transformed code
export const isFunctionComponent = component => (
    typeof component === 'function'
    && String(component)
        .includes('return')
    && !!String(component)
        .match(FUNCTION_REGEX)
    && String(component)
        .includes('.createElement')
);

export const isComponent = component => isClassComponent(component) || isFunctionComponent(component);

export const isElement = typeElement => React.isValidElement(typeElement);

export const isDOMTypeElement = typeElement => isElement(typeElement) && typeof typeElement.type === 'string';

export const isCompositeTypeElement = typeElement => isElement(typeElement) && typeof typeElement.type === 'function';

export const isCompatible = item => isElement(item) || isComponent(item);


