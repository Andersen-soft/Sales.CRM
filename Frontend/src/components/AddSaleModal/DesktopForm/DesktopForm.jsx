// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { pathOr } from 'ramda';
import {
    Dialog,
    IconButton,
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Typography,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { useTranslation } from 'crm-hooks/useTranslation';
import NewContactForm from 'crm-components/common/newContactForm/NewContactForm';
import Radio from 'crm-ui/CRMRadio/CRMRadio';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMIcon from 'crm-icons';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import getDeliveryDirector from 'crm-utils/sales/getDeliveryDirector';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { SOURCE_REFERENCE_ID } from 'crm-constants/salePage/saleCardConstant';
import CRMIndustryList from 'crm-ui/CRMIndustryList/CRMIndustryList';
import ContactList from '../attributes/ContactList';
import Footer from '../attributes/Footer';
import ExistsCompanyDialog from '../ExistsCompanyDialog';
import {
    NEW_COMPANY,
    NEW_CONTACT,
    EXISTING_COMPANY,
    EXISTING_CONTACT,
    SOURCE_FIELD,
} from 'crm-constants/addSaleModal/addSaleModalConstatnts';

import type { Contact } from 'crm-types/resourceDataTypes';
import type { Suggestion, SourceSuggestion, IndustryOptions } from '../AddSaleModal';

import styles from './DesktopFormStyles';

type Props = {
    open: boolean,
    onClose: () => void,
    classes: Object,
    handleSubmit: () => void,
    handleConfirmationDialogOpen: () => void,
    showConfirmationDialog: boolean,
    setShowConfirmationDialog: (show: boolean) => void,
    values: Object,
    errors: Object,
    touched: Object,
    status: Object,
    handleChangeCompanyCheckbox: (SyntheticInputEvent<HTMLInputElement>) => void,
    searchCompany: Array<Suggestion>,
    handleCompanyChange: (Suggestion | null) => void,
    handleBlurExistsCompany: (SyntheticInputEvent<HTMLInputElement>) => Promise<*>,
    handleExistsCompanyDialogClose: () => void,
    handleExistsCompanyDialogContinue: () => void,
    handleNewCompanyChange: (Suggestion | null) => Promise<*>,
    handleBlur: (string) => (SyntheticInputEvent<HTMLInputElement>) => void,
    newCompanyInputChange: (string, Object) => void,
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    handlePhoneChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    trimValue: (SyntheticInputEvent<HTMLInputElement>) => void,
    handleCommentChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    sourcesSuggestions: Array<SourceSuggestion>,
    handleSourceChange: (SourceSuggestion | null) => void,
    loadingSourceList: boolean,
    handleRecomendationChange: (Suggestion | null) => void,
    commentError: string,
    handleChangeContactCheckbox: (SyntheticInputEvent<HTMLInputElement>) => void,
    contactFetchValues: {
        countriesSuggestions: { label: string, value: number },
        countryId: number,
        socialContactsSuggestions: { label: string, value: number },
    },
    fetchContactValues: () => Promise<*>,
    handleChangeContactFields: (string, any) => void,
    contactsList: Array<Contact>,
    selectContact: (Contact) => void,
    isCheckedContacts: (number) => boolean,
    loadingContacts: boolean,
    industrySuggestions: Array<IndustryOptions>,
    handleIndustryChange: () => void,
    loadingIndustryList: boolean,
}

const DesktopForm = ({
    open,
    onClose,
    classes,
    handleSubmit,
    handleConfirmationDialogOpen,
    showConfirmationDialog,
    setShowConfirmationDialog,
    values,
    errors,
    touched,
    status,
    handleChangeCompanyCheckbox,
    searchCompany,
    handleCompanyChange,
    handleBlurExistsCompany,
    handleExistsCompanyDialogClose,
    handleExistsCompanyDialogContinue,
    handleNewCompanyChange,
    handleBlur,
    newCompanyInputChange,
    handleChange,
    handlePhoneChange,
    trimValue,
    handleCommentChange,
    sourcesSuggestions,
    handleSourceChange,
    loadingSourceList,
    handleRecomendationChange,
    commentError,
    handleChangeContactCheckbox,
    contactFetchValues,
    fetchContactValues,
    handleChangeContactFields,
    contactsList,
    selectContact,
    isCheckedContacts,
    loadingContacts,
    industrySuggestions,
    handleIndustryChange,
    loadingIndustryList,
}: Props) => {
    const translations = {
        emptyBlock: useTranslation('common.emptyBlock'),
        companyDetails: useTranslation('header.reportAddSale.company.companyDetails'),
        companyNew: useTranslation('header.reportAddSale.company.companyNew'),
        companyExist: useTranslation('header.reportAddSale.company.companyExist'),
        companyName: useTranslation('header.reportAddSale.company.companyName'),
        companyWebsite: useTranslation('header.reportAddSale.company.companyWebsite'),
        companyPhone: useTranslation('header.reportAddSale.company.companyPhone'),
        comment: useTranslation('common.comment'),
        contactDetails: useTranslation('header.reportAddSale.contact.contactDetails'),
        contactNew: useTranslation('header.reportAddSale.contact.contactNew'),
        contactExist: useTranslation('header.reportAddSale.contact.contactExist'),
        addSale: useTranslation('header.add.addSale'),
        errorNewCompany: useTranslation(errors.newCompany),
        errorLink: useTranslation(errors.link),
        errorCompanyPhone: useTranslation(errors.companyPhone),
        errorComment: useTranslation(commentError),
        errorCompany: useTranslation(errors.company),
        errorSource: useTranslation(errors.source),
        source: useTranslation('header.reportAddSale.company.companySource'),
        recommendationCompany: useTranslation('header.reportAddSale.company.recommendationCompany'),
        industry: useTranslation('header.reportAddSale.company.industry'),
    };

    return (
        <Dialog
            scroll='body'
            open={open}
            onClose={handleConfirmationDialogOpen}
            classes={{ paper: classes.container }}
        >
            <Grid className={classes.wrapper}>
                <form
                    onSubmit={handleSubmit}
                    className={classes.formStyle}
                >
                    <Grid container>
                        <Grid
                            item
                            className={classes.leftContainer}
                        >
                            <Typography className={classes.blockTitle}>
                                {translations.companyDetails}
                            </Typography>
                            <Grid
                                item
                                className={classes.newCompany}
                            >
                                <FormControl>
                                    <RadioGroup
                                        className={classes.checkboxCroup}
                                        value={values.createNewCompany}
                                        onChange={handleChangeCompanyCheckbox}
                                        row
                                    >
                                        <FormControlLabel
                                            label={
                                                <Typography className={classes.checkboxLabel}>
                                                    {translations.companyNew}
                                                </Typography>
                                            }
                                            value={NEW_COMPANY}
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            label={
                                                <Typography className={classes.checkboxLabel}>
                                                    {translations.companyExist}
                                                </Typography>
                                            }
                                            value={EXISTING_COMPANY}
                                            control={<Radio />}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                {
                                    values.createNewCompany === NEW_COMPANY
                                        ? <Grid item>
                                            <ExistsCompanyDialog
                                                company={values.company}
                                                status={status}
                                                onHandleExistsCompanyDialogClose={handleExistsCompanyDialogClose}
                                                onHandleExistsCompanyDialogContinue={handleExistsCompanyDialogContinue}
                                            />
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
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
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
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
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
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
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
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
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
                                                <CRMAutocompleteSelect
                                                    controlled
                                                    options={industrySuggestions}
                                                    value={values.industry}
                                                    isMulti
                                                    name='industry'
                                                    onChange={handleIndustryChange}
                                                    maxMenuHeight={350}
                                                    menuPlacement='top'
                                                    label={translations.industry}
                                                    isLoading={loadingIndustryList}
                                                />
                                            </Grid>
                                        </Grid>
                                        : <>
                                            <Grid
                                                item
                                                className={classes.field}
                                            >
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
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                container
                                                className={classes.field}
                                                justify='space-between'
                                                alignItems='center'
                                                wrap='nowrap'
                                            >
                                                <Typography className={classes.textLabel}>{translations.industry}:</Typography>
                                                <CRMIndustryList
                                                    industry={pathOr([], ['industry'], values)}
                                                    listClasses={{
                                                        empty: classes.emptyLabel,
                                                        container: classes.industryList,
                                                    }}
                                                />
                                            </Grid>
                                    </>
                                }
                                <Grid
                                    item
                                    container
                                    className={classes.field}
                                    justify='space-between'
                                    alignItems='center'
                                >
                                    <Typography className={classes.textLabel}>Delivery Director:</Typography>
                                    {pathOr(null, ['label'], getDeliveryDirector(values))
                                        || <CRMEmptyBlock className={classes.emptyBlock} />}
                                </Grid>
                                <Grid
                                    item
                                    className={classes.lastField}
                                >
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
                                    && <Grid item>
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
                        </Grid>
                        <Grid className={classes.devider} />
                        <Grid
                            item
                            className={classes.rightContainer}
                        >
                            <Grid container>
                                <Typography className={cn(classes.blockTitle, classes.contactTitle)}>
                                    {translations.contactDetails}
                                </Typography>
                                <IconButton
                                    className={classes.exitButton}
                                    onClick={handleConfirmationDialogOpen}
                                >
                                    <CRMIcon IconComponent={Close} />
                                </IconButton>
                            </Grid>
                            <Grid
                                item
                                className={classes.newContact}
                            >
                                <FormControl>
                                    <RadioGroup
                                        className={classes.checkboxCroup}
                                        value={values.createNewContact}
                                        onChange={handleChangeContactCheckbox}
                                        row
                                    >
                                        <FormControlLabel
                                            label={
                                                <Typography className={classes.checkboxLabel}>
                                                    {translations.contactNew}
                                                </Typography>
                                            }
                                            value={NEW_CONTACT}
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            label={
                                                <Typography className={classes.checkboxLabel}>
                                                    {translations.contactExist}
                                                </Typography>
                                            }
                                            value={EXISTING_CONTACT}
                                            control={<Radio />}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                {
                                    values.createNewContact === NEW_CONTACT
                                        ? (<NewContactForm
                                            valuesFromRequest={contactFetchValues}
                                            fetchValues={fetchContactValues}
                                            values={values}
                                            onHandleChange={handleChangeContactFields}
                                            onHandleBlur={handleBlur}
                                            onHandleBlurTrim={trimValue}
                                            errors={errors}
                                            touched={touched}
                                            alignItemForGrid='flex-start'
                                            classes={{
                                                rightColumnContainer: classes.rightColumnContainer,
                                                leftColumnContainer: classes.leftColumnContainer,
                                            }}
                                        />)
                                        : <ContactList
                                            classes={classes}
                                            contactsList={contactsList}
                                            selectContact={selectContact}
                                            isCheckedContacts={isCheckedContacts}
                                            values={values}
                                            loadingContacts={loadingContacts}
                                        />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Footer
                        classes={classes}
                        handleConfirmationDialogOpen={handleConfirmationDialogOpen}
                        showConfirmationDialog={showConfirmationDialog}
                        setShowConfirmationDialog={setShowConfirmationDialog}
                        onClose={onClose}
                    />
                </form>
            </Grid>
        </Dialog>
    );
};

export default withStyles(styles)(DesktopForm);
