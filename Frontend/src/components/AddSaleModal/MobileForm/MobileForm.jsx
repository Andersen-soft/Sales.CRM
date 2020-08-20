// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    Grid,
    Typography,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons/index';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMIcon from 'crm-icons';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import ExistsCompanyDialog from '../ExistsCompanyDialog';
import SelectCompany from './SelectCompany';
import SelectContact from './SelectContact';

import type { Contact } from 'crm-types/resourceDataTypes';
import type { Suggestion, SourceSuggestion, IndustryOptions } from '../AddSaleModal';

import styles from './MobileFormStyles';

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
    commentError: string,
    industrySuggestions: Array<IndustryOptions>,
    handleIndustryChange: () => void,
    loadingIndustryList: boolean,
}

const FIRST_STEP = 'firstStep';
const SECOND_STEP = 'secondStep';

const MobileForm = ({
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
    handleChangeContactCheckbox,
    contactFetchValues,
    fetchContactValues,
    handleChangeContactFields,
    contactsList,
    selectContact,
    isCheckedContacts,
    loadingContacts,
    commentError,
    industrySuggestions,
    handleIndustryChange,
    loadingIndustryList,
}: Props) => {
    const [step, setStep] = useState(FIRST_STEP);

    const translations = {
        addSale: useTranslation('header.add.addSale'),
        save: useTranslation('common.save'),
        cancel: useTranslation('common.cancel'),
        dialogCancel: useTranslation('header.reportAddSale.dialogCancel'),
        next: useTranslation('common.next'),
        back: useTranslation('common.back'),
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{ paper: classes.container }}
        >
            <Grid>
                <form onSubmit={handleSubmit}>
                    <DialogTitle classes={{ root: classes.withoutPadding }}>
                        <Grid
                            container
                            justify='flex-start'
                            alignItems='center'
                        >
                            <IconButton
                                className={classes.exitButton}
                                onClick={handleConfirmationDialogOpen}
                            >
                                <CRMIcon IconComponent={ArrowBackIos} />
                            </IconButton>
                            <Typography>{translations.addSale}</Typography>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        {step === FIRST_STEP
                            ? <SelectCompany
                                values={values}
                                touched={touched}
                                errors={errors}
                                handleChangeCompanyCheckbox={handleChangeCompanyCheckbox}
                                searchCompany={searchCompany}
                                handleNewCompanyChange={handleNewCompanyChange}
                                handleBlur={handleBlur}
                                newCompanyInputChange={newCompanyInputChange}
                                handleChange={handleChange}
                                handlePhoneChange={handlePhoneChange}
                                trimValue={trimValue}
                                handleCommentChange={handleCommentChange}
                                handleCompanyChange={handleCompanyChange}
                                handleBlurExistsCompany={handleBlurExistsCompany}
                                sourcesSuggestions={sourcesSuggestions}
                                handleSourceChange={handleSourceChange}
                                loadingSourceList={loadingSourceList}
                                handleRecomendationChange={handleRecomendationChange}
                                commentError={commentError}
                                industrySuggestions={industrySuggestions}
                                handleIndustryChange={handleIndustryChange}
                                loadingIndustryList={loadingIndustryList}
                            />
                            : <SelectContact
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChangeContactCheckbox={handleChangeContactCheckbox}
                                contactFetchValues={contactFetchValues}
                                fetchContactValues={fetchContactValues}
                                handleChangeContactFields={handleChangeContactFields}
                                handleBlur={handleBlur}
                                trimValue={trimValue}
                                contactsList={contactsList}
                                selectContact={selectContact}
                                isCheckedContacts={isCheckedContacts}
                                loadingContacts={loadingContacts}
                            />
                        }
                        <ExistsCompanyDialog
                            company={values.company}
                            status={status}
                            onHandleExistsCompanyDialogClose={handleExistsCompanyDialogClose}
                            onHandleExistsCompanyDialogContinue={handleExistsCompanyDialogContinue}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid
                            container
                            justify='center'
                            className={classes.mobileFooter}
                        >
                            <Grid item className={classes.buttonContainer}>
                                <CRMButton
                                    size='small'
                                    variant='outlined'
                                    onClick={step === FIRST_STEP ? handleConfirmationDialogOpen : () => setStep(FIRST_STEP)}
                                    className={classes.firstButton}
                                >
                                    {step === FIRST_STEP ? translations.cancel : translations.back}
                                </CRMButton>
                            </Grid>
                            <Grid item className={classes.buttonContainer}>
                                {step === FIRST_STEP
                                    ? <CRMButton
                                        key={FIRST_STEP}
                                        primary
                                        type='button'
                                        size='small'
                                        onClick={() => setStep(SECOND_STEP)}
                                    >
                                        {translations.next}
                                    </CRMButton>
                                    : <CRMButton
                                        key={SECOND_STEP}
                                        primary
                                        type='submit'
                                        size='small'
                                    >
                                        {translations.save}
                                    </CRMButton>
                                }
                            </Grid>
                        </Grid>
                        <CancelConfirmation
                            showConfirmationDialog={showConfirmationDialog}
                            onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                            onConfirm={onClose}
                            text={translations.dialogCancel}
                        />
                    </DialogActions>
                </form>
            </Grid>
        </Dialog>
    );
};

export default withStyles(styles)(MobileForm);
