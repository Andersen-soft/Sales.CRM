// @flow

import React, { useState, useEffect, memo } from 'react';
import { Grid } from '@material-ui/core';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

type Props = {
    values: [string, string, boolean, ?RegExp],
    isEdit: boolean,
    updateEditRowState: (key: string, value: string | Error) => void,
};

const areEqualProps = (
    { values: [prevValue], isEdit: prevIsEdit },
    { values: [nextValue], isEdit: nextIsEdit }
) => (prevValue === nextValue) && (prevIsEdit === nextIsEdit);

const InputCell = memo < Props > (({
    values: [value, key, required, pattern],
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localValue, setLocalValue] = useState(value);
    const [error, setError] = useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
        errorUrlValidation: useTranslation('forms.errorUrlValidation'),
        errorEmailValidation: useTranslation('forms.errorEmailValidation'),
        errorPhoneValidation: useTranslation('forms.errorPhoneValidation'),
    };

    const regExpErrorMessage = {
        email: translations.errorEmailValidation,
        emailPrivate: translations.errorEmailValidation,
        phone: translations.errorPhoneValidation,
        site: translations.errorUrlValidation,
        companyPhone: translations.errorPhoneValidation,
    };

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        setLocalValue(value);
        isEdit && setError(null);
    }, [isEdit]);

    const getErrorMessage = () => {
        switch (true) {
            case (required && !localValue.trim().length):
                return translations.errorRequiredField;
            case (pattern && localValue && (localValue.search(pattern) === -1)):
                return regExpErrorMessage[key];
            default: return null;
        }
    };

    const validate = () => {
        const errorMessage = getErrorMessage();

        setError(errorMessage);
        return !!errorMessage;
    };

    const onChange = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (key === 'phone') {
            (pattern && newValue.search(pattern) !== -1) && setLocalValue(newValue);
        } else {
            setLocalValue(newValue);
        }
    };

    const onBlur = () => {
        if (!validate()) {
            updateEditRowState(key, localValue);
        } else {
            updateEditRowState(key, Error());
        }
    };

    return isEdit
        ? <CRMInput
            value={localValue}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            fullWidth
        />
        : <Grid>
            {localValue || <CRMEmptyBlock />}
        </Grid>;
}, areEqualProps); // NOSONAR

export default InputCell;
