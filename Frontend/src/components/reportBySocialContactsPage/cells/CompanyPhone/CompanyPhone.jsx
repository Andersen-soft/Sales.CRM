// @flow

import React, { useState, useEffect, memo } from 'react';
import { isNil, pathOr, equals } from 'ramda';
import { Grid } from '@material-ui/core';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { PHONE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';

type Props = {
    values: [Object, Object],
    isEdit: boolean,
    updateEditRowState: (key: string, value: string | Error) => void,
};

const NEW_COMPANY_ID = -1;

const areEqualProps = (
    { values: [prevCompany, prevEditedCompany], isEdit: prevIsEdit },
    { values: [nextCompany, nextEditedCompany], isEdit: nextIsEdit }
) => (prevCompany.id === nextCompany.id)
    && equals(prevEditedCompany, nextEditedCompany)
    && (prevIsEdit === nextIsEdit);

const CompanyPhone = memo < Props > (({
    values: [company, editedCompany],
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localPhone, setLocalPhone] = useState(company.phone);
    const [error, setError] = useState(null);

    const translations = {
        errorPhoneValidation: useTranslation('forms.errorPhoneValidation'),
    };

    useEffect(() => {
        setLocalPhone(company.phone);
    }, [company]);

    useEffect(() => {
        if (isEdit) {
            const phone = pathOr('', ['phone'], editedCompany);

            !(phone instanceof Error) && setLocalPhone(phone);
        }
    }, [editedCompany]);

    useEffect(() => {
        setLocalPhone(company.phone);
        isEdit && setError(null);
    }, [isEdit]);

    const validate = () => {
        if (localPhone && !PHONE_REGEXP.test(localPhone)) {
            setError(translations.errorPhoneValidation);
            return true;
        }

        setError(null);

        return false;
    };

    const onBlur = () => {
        if (!validate()) {
            updateEditRowState('company', { ...editedCompany, phone: localPhone });
        } else {
            updateEditRowState('company', { ...editedCompany, phone: Error() });
        }
    };

    const showEdit = isEdit
        && (editedCompany && (editedCompany.id === NEW_COMPANY_ID || isNil(editedCompany.id)));

    return showEdit
        ? <CRMInput
            value={localPhone}
            onChange={({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => setLocalPhone(newValue)}
            onBlur={onBlur}
            error={error}
            fullWidth
        />
        : <Grid>
            {localPhone || <CRMEmptyBlock />}
        </Grid>;
}, areEqualProps); // NOSONAR

export default CompanyPhone;
