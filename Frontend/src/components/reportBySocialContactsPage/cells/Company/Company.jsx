// @flow

import React, { useState, useEffect, useCallback, memo } from 'react';
import { pathOr, equals } from 'ramda';
import { Grid } from '@material-ui/core';
import debounce from 'lodash.debounce';
import CRMAutocompleteSelect, { INPUT_CHANGE_ACTION }
    from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { getCompaniesSearch } from 'crm-api/companyCardService/companyCardService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { useTranslation } from 'crm-hooks/useTranslation';

type CompanyType = {
    name: string,
    id: number | null,
    site?: string | null,
    phone?: string | null,
    url?: string | null,
}

type Props = {
    values: [CompanyType, CompanyType],
    isEdit: boolean,
    updateEditRowState: (key: string, value: CompanyType | Error) => void,
}

const NEW_COMPANY_ID = -1;

const areEqualProps = (
    { values: [prevCompany, prevEditedCompany], isEdit: prevIsEdit },
    { values: [nextCompany, nextEditedCompany], isEdit: nextIsEdit }
) => (prevCompany.id === nextCompany.id)
    && equals(prevEditedCompany, nextEditedCompany)
    && (prevIsEdit === nextIsEdit);

const Company = memo < Props > (({
    values: [company, editedCompany],
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localCompany, setLoacalComapny] = useState(company);
    const [error, setError] = useState(null);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    useEffect(() => {
        setLoacalComapny({ ...company, id: pathOr(NEW_COMPANY_ID, ['id'], company) });
        setError(null);
    }, [isEdit]);

    const handleSearch = (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(searchCompanyValue, 150, CANCELED_REQUEST).then(({ content }) => {
            callback(content);
        });
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const changeCompany = (newCompany: CompanyType | null) => {
        setLoacalComapny(newCompany);

        if (newCompany) {
            updateEditRowState('company', { ...newCompany, site: newCompany.url });
            setError(null);
        } else {
            setError(translations.errorRequiredField);
            updateEditRowState('company', Error(translations.errorRequiredField));
        }
    };

    const onInputChange = (inputValue, { action }) => {
        if (action === INPUT_CHANGE_ACTION) {
            setError(null);
        }
    };

    const onBlur = ({ target: { value } }) => {
        if (value) {
            setLoacalComapny({ id: NEW_COMPANY_ID, name: value });
            updateEditRowState('company', { ...editedCompany, id: NEW_COMPANY_ID, name: value });
        }
    };

    return isEdit
        ? <CRMAutocompleteSelect
            cacheOptions
            async
            value={localCompany}
            loadOptions={debounceHandleSearch}
            controlled
            onChange={changeCompany}
            getOptionLabel={(option: CompanyType) => option.name}
            getOptionValue={(option: CompanyType) => option.id}
            error={error}
            onBlur={onBlur}
            menuPosition={'fixed'}
            menuShouldBlockScroll
            onInputChange={onInputChange}
        />
        : <Grid>
            {company.name}
        </Grid>;
}, areEqualProps); // NOSONAR

export default Company;
