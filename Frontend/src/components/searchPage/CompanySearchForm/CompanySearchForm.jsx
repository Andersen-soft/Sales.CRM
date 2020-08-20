// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import { KEY_ENTER } from 'crm-constants/keyCodes';
import { crmTrim } from 'crm-utils/trimValue';
import { ALLOWED_PHONE_SYMBOLS } from 'crm-constants/validationRegexps/validationRegexps';

import styles from '../SearchStyles';

type Suggestion = {
    value: number,
    label: string,
};

type SearchParams = {
    companyName?: string,
    companyUrl?: string,
    companyPhone?: string,
    companyDD?: { label: string, value: number },
    industry?: { label: string, value: number },
}

type Props = {
    classes: Object,
    searchParams: SearchParams,
    changeSearchParams: (key: string, value: string) => void,
    DDListSuggestions: Array<Suggestion>,
    searchCompany: () => void,
    loadingDD: boolean,
    clearSearchParams: () => void,
    industryList: Array<Object>,
    loadingIndustry: boolean,
}

const CompanySearchForm = ({
    classes,
    searchParams: {
        companyName = '',
        companyUrl = '',
        companyPhone = '',
        companyDD = null,
        industry = null,
    },
    changeSearchParams,
    DDListSuggestions,
    searchCompany,
    loadingDD,
    clearSearchParams,
    industryList,
    loadingIndustry,
}: Props) => {
    const translations = {
        companyName: useTranslation('globalSearch.companyName'),
        companyUrl: useTranslation('globalSearch.companyUrl'),
        companyPhone: useTranslation('globalSearch.companyPhone'),
        companyDD: useTranslation('globalSearch.companyDD'),
        find: useTranslation('globalSearch.find'),
        clear: useTranslation('globalSearch.clear'),
        industry: useTranslation('globalSearch.industry'),
    };

    const handleKeyPress = ({ key, target: { value } }, fieldKey) => {
        if (key === KEY_ENTER.key) {
            changeSearchParams(fieldKey, crmTrim(value));
            searchCompany();
        }
    };

    const handleChangeCompany = ({ target: { value } }) => changeSearchParams('companyName', value);

    const handleBlurCompany = ({ target: { value } }) => changeSearchParams('companyName', crmTrim(value));

    const handleChangeCompanyUrl = ({ target: { value } }) => changeSearchParams('companyUrl', value);

    const handleBlurCompanyUrl = ({ target: { value } }) => changeSearchParams('companyUrl', crmTrim(value));

    const handleChangePhone = ({ target: { value } }) => {
        if (value.search(ALLOWED_PHONE_SYMBOLS) !== -1) {
            changeSearchParams('companyPhone', value);
        }
    };

    const handleBlurPhone = ({ target: { value } }) => changeSearchParams('companyPhone', crmTrim(value));

    return (
        <Grid
            container
            direction='column'
        >
            <Grid
                container
                item
            >
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={handleChangeCompany}
                        onKeyPress={e => handleKeyPress(e, 'companyName')}
                        onBlur={handleBlurCompany}
                        value={companyName}
                        label={translations.companyName}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={handleChangeCompanyUrl}
                        onKeyPress={e => handleKeyPress(e, 'companyUrl')}
                        onBlur={handleBlurCompanyUrl}
                        value={companyUrl}
                        label={translations.companyUrl}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMInput
                        onChange={handleChangePhone}
                        onKeyPress={e => handleKeyPress(e, 'companyPhone')}
                        onBlur={handleBlurPhone}
                        value={companyPhone}
                        label={translations.companyPhone}
                        fullWidth
                    />
                </Grid>
                <Grid
                    item
                    className={classes.inputWrapper}
                >
                    <CRMAutocompleteSelect
                        onChange={newValue => changeSearchParams('companyDD', newValue)}
                        options={DDListSuggestions}
                        value={companyDD}
                        label={translations.companyDD}
                        controlled
                        containerStyles={{ marginTop: 22 }}
                        isLoading={loadingDD}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.industryWrapper}
                >
                    <CRMAutocompleteSelect
                        controlled
                        options={industryList}
                        value={industry}
                        isMulti
                        onChange={newValue => changeSearchParams('industry', newValue)}
                        maxMenuHeight={350}
                        label={translations.industry}
                        isLoading={loadingIndustry}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                item
                className={classes.buttonRow}
            >
                <CRMButton
                    primary
                    onClick={searchCompany}
                    size='large'
                    className={classes.button}
                >
                    {translations.find}
                </CRMButton>
                <CRMButton
                    onClick={clearSearchParams}
                    size='large'
                >
                    {translations.clear}
                </CRMButton>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(CompanySearchForm);
