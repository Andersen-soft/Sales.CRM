// @flow

import React, { useState, useEffect, memo } from 'react';
import { isNil, pathOr, equals } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Link } from '@material-ui/core';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { SITE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';

import styles from './CompanySiteStyles';

type Props = {
    values: [Object, Object],
    isEdit: boolean,
    updateEditRowState: (key: string, value: string | Error) => void,
    classes: Object,
};

const NEW_COMPANY_ID = -1;

const areEqualProps = (
    { values: [prevCompany, prevEditedCompany], isEdit: prevIsEdit },
    { values: [nextCompany, nextEditedCompany], isEdit: nextIsEdit }
) => (prevCompany.id === nextCompany.id)
    && equals(prevEditedCompany, nextEditedCompany)
    && (prevIsEdit === nextIsEdit);

const CompanySite = memo < Props > (({
    values: [company, editedCompany],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localSite, setLocalSite] = useState(company.site);
    const [error, setError] = useState(null);

    const translations = {
        errorUrlValidation: useTranslation('forms.errorUrlValidation'),
    };

    useEffect(() => {
        setLocalSite(company.site);
    }, [company]);

    useEffect(() => {
        if (isEdit) {
            const site = pathOr('', ['site'], editedCompany);

            !(site instanceof Error) && setLocalSite(site);
        }
    }, [editedCompany]);

    useEffect(() => {
        setLocalSite(company.site);
        isEdit && setError(null);
    }, [isEdit]);

    const validate = () => {
        if (localSite && !SITE_REGEXP.test(localSite)) {
            setError(translations.errorUrlValidation);
            return true;
        }

        setError(null);

        return false;
    };

    const onBlur = () => {
        if (!validate()) {
            updateEditRowState('company', { ...editedCompany, site: localSite });
        } else {
            updateEditRowState('company', { ...editedCompany, site: Error() });
        }
    };

    const showEdit = isEdit
        && (editedCompany && (editedCompany.id === NEW_COMPANY_ID || isNil(editedCompany.id)));

    return showEdit
        ? <CRMInput
            value={localSite}
            onChange={({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => setLocalSite(newValue)}
            onBlur={onBlur}
            error={error}
            fullWidth
            placeholder='http://'
        />
        : <Grid>
            {localSite
                ? <Link
                    rel='noopener noreferrer'
                    target='_blank'
                    href={localSite}
                    className={classes.link}
                >
                    {localSite}
                </Link>
                : <CRMEmptyBlock />}
        </Grid>;
}, areEqualProps); // NOSONAR

export default withStyles(styles)(CompanySite);
