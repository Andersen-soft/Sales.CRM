// @flow

export const UNFILLED_RU: string = 'Отсутствует';
export const UNFILLED_EN: string = 'Unfilled';
export const NONE_EN: string = 'None';

export default (value: string) => [UNFILLED_RU, UNFILLED_EN, NONE_EN].includes(value);
