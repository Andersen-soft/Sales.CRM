// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import {
    Grid,
    Typography,
    Button,
} from '@material-ui/core';
import cn from 'classnames';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { EXISTING_COMPANY, NEW_COMPANY, SOURCE_FIELD } from 'crm-constants/addSaleModal/addSaleModalConstatnts';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import getDeliveryDirector from 'crm-utils/sales/getDeliveryDirector';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMIndustryList from 'crm-ui/CRMIndustryList/CRMIndustryList';
import { SOURCE_REFERENCE_ID } from 'crm-constants/salePage/saleCardConstant';

import type { Suggestion, SourceSuggestion, IndustryOptions } from '../AddSaleModal';

import styles from './MobileFormStyles';

type Props = {
    classes: Object,
    values: Object,
    touched: Object,
    errors: Object,
    handleChangeCompanyCheckbox: (SyntheticInputEvent<HTMLInputElement>) => void,
    searchCompany: Array<Suggestion>,
    handleNewCompanyChange: (Suggestion | null) => Promise<*>,
    handleBlur: (string) => (SyntheticInputEvent<HTMLInputElement>) => void,
    newCompanyInputChange: (string, Object) => void,
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    handlePhoneChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    trimValue: (SyntheticInputEvent<HTMLInputElement>) => void,
    handleCommentChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    handleCompanyChange: (Suggestion | null) => void,
    handleBlurExistsCompany: (SyntheticInputEvent<HTMLInputElement>) => Promise<*>,
    sourcesSuggestions: Array<SourceSuggestion>,
    handleSourceChange: (SourceSuggestion | null) => void,
    loadingSourceList: boolean,
    handleRecomendationChange: (Suggestion | null) => void,
    commentError: string,
    industrySuggestions: Array<IndustryOptions>,
    handleIndustryChange: () => void,
    loadingIndustryList: boolean,
};

const SelectCompany = ({
    classes,
    values,
    touched,
    errors,
    handleChangeCompanyCheckbox,
    searchCompany,
    handleNewCompanyChange,
    handleBlur,
    newCompanyInputChange,
    handleChange,
    handlePhoneChange,
    trimValue,
    handleCommentChange,
    handleCompanyChange,
    handleBlurExistsCompany,
    sourcesSuggestions,
    handleSourceChange,
    loadingSourceList,
    handleRecomendationChange,
    commentError,
    industrySuggestions,
    handleIndustryChange,
    loadingIndustryList,
}: Props) => {
    const translations = {
        emptyBlock: useTranslation('common.emptyBlock'),
        companyNew: useTranslation('header.reportAddSale.company.companyNew'),
        companyExist: useTranslation('header.reportAddSale.company.companyExist'),
        companyName: useTranslation('header.reportAddSale.company.companyName'),
        companyWebsite: useTranslation('header.reportAddSale.company.companyWebsite'),
        companyPhone: useTranslation('header.reportAddSale.company.companyPhone'),
        comment: useTranslation('common.comment'),
        errorNewCompany: useTranslation(errors.newCompany),
        errorLink: useTranslation(errors.link),
        errorCompanyPhone: useTranslation(errors.companyPhone),
        errorComment: useTranslation(commentError),
        errorCompany: useTranslation(errors.company),
        errorSource: useTranslation(errors.source),
        source: useTranslation('header.reportAddSale.company.companySource'),
        recommendationCompany: useTranslation('header.reportAddSale.company.recommendationCompany'),
        newCompanyInfo: useTranslation('header.reportAddSale.newCompanyInfo'),
        company: useTranslation('header.reportAddSale.existsCompany.company'),
        industry: useTranslation('header.reportAddSale.company.industry'),
    };

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            alignItems='stretch'
        >
            <Typography className={classes.title}>
                {translations.company}
            </Typography>
            <Grid
                className={classes.buttonWrapper}
                container
                alignItems='center'
                justify='space-between'
            >
                <Button
                    className={cn(classes.button, { [classes.activeButton]: values.createNewCompany === NEW_COMPANY })}
                    onClick={event => {
                        event.target.value = NEW_COMPANY;
                        handleChangeCompanyCheckbox(event);
                    }}
                >
                    {translations.companyNew}
                </Button>
                <Button
                    className={cn(classes.button, { [classes.activeButton]: values.createNewCompany === EXISTING_COMPANY })}
                    onClick={event => {
                        event.target.value = EXISTING_COMPANY;
                        handleChangeCompanyCheckbox(event);
                    }}
                >
                    {translations.companyExist}
                </Button>
            </Grid>
            {
                values.createNewCompany === NEW_COMPANY
                    ? <Grid item>
                        <Typography className={classes.subTitle}>
                            {translations.newCompanyInfo}
                        </Typography>
                        <Grid item className={classes.inputWrapper}>
                            <CRMAutocompleteSelect
                                cacheOptions
                                async
                                value={values.newCompany}
                                loadOptions={searchCompany}
                                controlled
                                onChange={handleNewCompanyChange}
                                getOptionLabel={({ name }) => name}
                                getOptionValue={({ id }) => id}
                                label={translations.companyName}
                                onBlur={handleBlur('newCompany')}
                                error={touched.newCompany && translations.errorNewCompany}
                                menuPosition='fixed'
                                menuShouldBlockScroll
                                onInputChange={newCompanyInputChange}
                            />
                        </Grid>
                        <Grid item className={classes.inputWrapper}>
                            <CRMInput
                                fullWidth
                                name='link'
                                label={translations.companyWebsite}
                                placeholder='http://'
                                value={values.link}
                                onChange={handleChange}
                                onBlur={handleBlur('socialNetwork')}
                                error={touched.link && translations.errorLink}
                                InputLabelProps={{ classes: { root: classes.label } }}
                            />
                        </Grid>
                        <Grid item className={classes.inputWrapper}>
                            <CRMInput
                                fullWidth
                                name='companyPhone'
                                label={translations.companyPhone}
                                value={values.companyPhone}
                                onChange={handlePhoneChange}
                                onBlur={trimValue}
                                error={touched.companyPhone && translations.errorCompanyPhone}
                                InputLabelProps={{
                                    classes: { root: classes.label },
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <CRMTextArea
                                fullWidth
                                name='comment'
                                value={values.comment}
                                label={
                                    <Typography className={classes.commentLabel}>
                                        {translations.comment}
                                    </Typography>
                                }
                                onChange={handleCommentChange}
                                onBlur={trimValue}
                                className={classes.commentField}
                                rows={6}
                                rowsMax={6}
                            />
                            <Typography
                                className={cn(
                                    classes.commentMessage,
                                    { [classes.commentError]: translations.errorComment }
                                )}
                                align='right'
                            >
                                { translations.errorComment }
                            </Typography>
                        </Grid>
                        <Grid item className={classes.inputWrapper}>
                            <CRMAutocompleteSelect
                                controlled
                                options={industrySuggestions}
                                value={values.industry}
                                isMulti
                                name='industry'
                                onChange={handleIndustryChange}
                                label={translations.industry}
                                isLoading={loadingIndustryList}
                            />
                        </Grid>
                    </Grid>
                    : <Grid item className={classes.topContainer}>
                        <Typography className={classes.subTitle}>
                            {translations.company}
                        </Typography>
                        <Grid item className={classes.inputWrapper}>
                            <CRMAutocompleteSelect
                                cacheOptions
                                async
                                value={values.company}
                                loadOptions={searchCompany}
                                onChange={handleCompanyChange}
                                controlled
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id}
                                label={translations.companyName}
                                onBlur={handleBlurExistsCompany}
                                error={touched.company && translations.errorCompany}
                                menuPosition='fixed'
                                menuShouldBlockScroll
                                blurInputOnSelect={false}
                            />
                        </Grid>
                        <Grid
                            container
                            item
                            className={cn(classes.staticValue, classes.firstStataticValue)}
                            justify='space-between'
                            alignItems='center'
                            wrap='nowrap'
                        >
                            <Typography className={classes.textLabel}>{translations.industry}:</Typography>
                            <CRMIndustryList
                                industry={pathOr([], ['industry'], values)}
                                listClasses={{
                                    container: classes.industryList,
                                }}
                            />
                        </Grid>
                    </Grid>
            }
            <Grid
                item
                container
                className={classes.staticValue}
                justify='space-between'
                alignItems='center'
            >
                <Typography className={classes.textLabel}>Delivery Director:</Typography>
                {pathOr(null, ['label'], getDeliveryDirector(values))
                    || <CRMEmptyBlock />}
            </Grid>
            <Grid item className={classes.inputWrapper}>
                <CRMAutocompleteSelect
                    variant='outlined'
                    options={sourcesSuggestions}
                    value={values.source}
                    onChange={handleSourceChange}
                    onBlur={handleBlur(SOURCE_FIELD)}
                    containerStyles={{ marginTop: 22 }}
                    label={translations.source}
                    maxMenuHeight={218}
                    menuPlacement='top'
                    error={touched.source && translations.errorSource}
                    isLoading={loadingSourceList}
                />
            </Grid>
            {values.source.value === SOURCE_REFERENCE_ID
                && <Grid item className={classes.inputWrapper}>
                    <CRMAutocompleteSelect
                        cacheOptions
                        async
                        loadOptions={searchCompany}
                        onChange={handleRecomendationChange}
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                        label={translations.recommendationCompany}
                        maxMenuHeight={218}
                        menuPlacement='top'
                    />
                </Grid>
            }
        </Grid>
    );
};

export default withStyles(styles)(SelectCompany);
