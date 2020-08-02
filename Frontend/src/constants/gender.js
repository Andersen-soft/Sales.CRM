// @flow

export const MALE_KEY: string = 'MALE';
export const FEMALE_KEY: string = 'FEMALE';

export const GENDER_TRANSLATE_KEYS: Object = {
    [MALE_KEY]: 'gender.male',
    [FEMALE_KEY]: 'gender.female',
};

export type GenderType = {
    id: number,
    value: string | number,
    checked: boolean,
    translateKey: string,
};

export const GENDER_ITEMS: Array<GenderType> = [
    {
        id: 1,
        value: MALE_KEY,
        checked: false,
        translateKey: GENDER_TRANSLATE_KEYS[MALE_KEY],
    },
    {
        id: 2,
        value: FEMALE_KEY,
        checked: false,
        translateKey: GENDER_TRANSLATE_KEYS[FEMALE_KEY],
    },
];
