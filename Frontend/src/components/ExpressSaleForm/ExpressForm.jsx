// @flow

import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { useTranslation } from 'crm-hooks/useTranslation';
import { INPUT_REQUIRED_ERR_KEY } from 'crm-constants/forms';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

type Props = {
    classes: Object,
    countriesSuggestions: Array<{ label: string, name: number }>,
    loadCountry: boolean,
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    handleBlur: (e: SyntheticEvent<EventTarget>) => void,
    values: Object,
    errors: Object,
    touched: Object,
    loading: boolean,
    changePhone: (e: SyntheticInputEvent<HTMLInputElement>) => void,
};

const ExpressForm = ({
    classes,
    countriesSuggestions,
    loadCountry,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    loading,
    changePhone,
}: Props) => {
    const translations = {
        fillTheForm: useTranslation('expressSale.fillTheForm'),
        name: useTranslation('expressSale.name'),
        email: useTranslation('expressSale.email'),
        phone: useTranslation('expressSale.phone'),
        country: useTranslation('expressSale.country'),
        comment: useTranslation('expressSale.comment'),
        save: useTranslation('common.save'),
        errorEmail: useTranslation(errors.email),
    };

    const isMobile = useMobile();

    return (
        <Grid className={classes.paper}>
            <Typography className={classes.title} variant='h1'>
                {translations.fillTheForm}
            </Typography>
            <Grid className={classes.row}>
                <CRMInput
                    className={classes.inputWrapper}
                    label={translations.name}
                    name='name'
                    fullWidth
                    onChange={handleChange}
                    value={values.name}
                />
            </Grid>
            <Grid className={classes.row}>
                <CRMInput
                    className={classes.inputWrapper}
                    label={translations.email}
                    name='email'
                    fullWidth
                    onChange={handleChange}
                    value={values.email}
                    error={touched.email && (errors.email === INPUT_REQUIRED_ERR_KEY ? null : translations.errorEmail)}
                    showErrorMessage={isMobile}
                />
            </Grid>
            <Grid className={classes.row}>
                <CRMInput
                    className={classes.inputWrapper}
                    label={translations.phone}
                    name='phone'
                    fullWidth
                    onChange={changePhone}
                    value={values.phone}
                />
            </Grid>
            <Grid className={classes.row}>
                <CRMAutocompleteSelect
                    variant='outlined'
                    options={countriesSuggestions}
                    value={values.country}
                    onChange={country => {
                        const changeCompany = handleChange('country');

                        changeCompany && changeCompany(country);
                    }}
                    containerStyles={{ marginTop: 22 }}
                    label={`${translations.country}*`}
                    maxMenuHeight={218}
                    isLoading={loadCountry}
                    controlled
                />
            </Grid>
            <Grid className={classes.row}>
                <CRMTextArea
                    fullWidth
                    name='comment'
                    value={values.comment}
                    label={translations.comment}
                    onChange={handleChange}
                    className={classes.commentField}
                    rows={6}
                    rowsMax={6}
                />
            </Grid>
            <Grid
                container
                justify='center'
            >
                <CRMButton
                    primary
                    type='submit'
                    size='large'
                    disabled={loading}
                >
                    {translations.save}
                </CRMButton>
            </Grid>
            {loading && <CRMLoader />}
        </Grid>
    );
};

export default ExpressForm;
