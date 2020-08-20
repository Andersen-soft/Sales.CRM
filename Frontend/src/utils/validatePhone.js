// @flow

import {
    ALLOWED_PHONE_SYMBOLS,
} from 'crm-constants/validationRegexps/validationRegexps';

const validatePhone = (value: string) => {
    const phoneMatched = value.match(ALLOWED_PHONE_SYMBOLS);

    return !!phoneMatched && !!phoneMatched.length;
};

export default validatePhone;
