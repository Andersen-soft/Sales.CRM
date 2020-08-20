// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Typography,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { MAX_INPUT_LENGTH } from 'crm-constants/addResumeRequest/addResumeRequestConstants';
import CRMIcon from 'crm-icons';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { useTranslation } from 'crm-hooks/useTranslation';
import InputFile from 'crm-components/common/InputFile';

import SalesBlock from '../../AddRequestCommon/SalesBlock/SalesBlock';

import type { FormikProps } from 'crm-types/formik';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { Company } from '../AddresumeRequest';

import styles from '../../AddRequestCommon/MobileFormStyles';

type Props = {
    open: boolean,
    confirmationDialogOpen: () => void,
    submit: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    debounceHandleSearch: () => void,
    companyChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    searchCompanySuggestion: Company | null,
    nameChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    nameBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    changePriority: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    priorities: Array<{ title: string, value: string }>,
    priority: string,
    commentChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    commentBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    sales: Array<string>,
    salesMessage: string,
    selectedFiles: Array<Object>,
    changeInputFile: (files: FileList) => void,
    deleteFile: (number) => void,
    allFilesSize: number,
    disabled: boolean,
    showConfirmationDialog: boolean,
    setShowConfirmationDialog: (boolean) => void,
    onClose: () => void,
    loading: boolean,
    hideFields: boolean,
    companyOnInputChange?: () => void,
    searchCompanyInput?: string,
} & StyledComponentProps & FormikProps;

const MobileForm = ({
    classes,
    open,
    confirmationDialogOpen,
    submit,
    companyChange,
    debounceHandleSearch,
    touched,
    errors,
    values,
    searchCompanySuggestion,
    nameChange,
    companyOnInputChange,
    searchCompanyInput,
    nameBlur,
    setFieldValue,
    changePriority,
    priorities,
    priority,
    commentChange,
    commentBlur,
    sales,
    salesMessage,
    selectedFiles,
    changeInputFile,
    deleteFile,
    allFilesSize,
    disabled,
    showConfirmationDialog,
    setShowConfirmationDialog,
    onClose,
    loading,
    hideFields,
}: Props) => {
    const translations = {
        addRequestForCv: useTranslation('header.modals.addRequest.addRequestForCv'),
        companyName: useTranslation('header.modals.addRequest.companyName'),
        requestName: useTranslation('header.modals.addRequest.requestName'),
        deadline: useTranslation('header.modals.addRequest.deadline'),
        priority: useTranslation('header.modals.addRequest.priority'),
        comment: useTranslation('header.modals.addRequest.comment'),
        numberOfCharacters: useTranslation('header.modals.addRequest.numberOfCharacters'),
        cancel: useTranslation('header.modals.addRequest.cancel'),
        save: useTranslation('header.modals.addRequest.save'),
        areYouSureCV: useTranslation('header.modals.addRequest.areYouSureCV'),
        requiredField: useTranslation('header.modals.addRequest.requiredField'),
        requiredName: useTranslation(errors.name),
        responsibleRmErrorMessage: useTranslation('header.modals.addRequest.responsibleRmErrorMessage'),
    };

    return (
        <Dialog
            open={open}
            onClose={confirmationDialogOpen}
            classes={{ paper: classes.container }}
        >
            <Grid>
                <form onSubmit={submit}>
                    <DialogTitle classes={{ root: classes.withoutPadding }}>
                        <Grid
                            container
                            justify='flex-start'
                            alignItems='center'
                        >
                            <IconButton
                                className={classes.exitButton}
                                onClick={confirmationDialogOpen}
                            >
                                <CRMIcon IconComponent={ArrowBackIos} />
                            </IconButton>
                            <Typography>{translations.addRequestForCv}</Typography>
                        </Grid>
                    </DialogTitle>
                    <DialogContent classes={{ root: classes.withoutPadding }}>
                        <Grid
                            container
                            direction='column'
                            justify='flex-start'
                            alignItems='stretch'
                        >
                            <Grid
                                item
                                className={classes.inputWrapper}
                            >
                                <CRMAutocompleteSelect
                                    cacheOptions
                                    async
                                    value={searchCompanySuggestion}
                                    label={translations.companyName}
                                    loadOptions={debounceHandleSearch}
                                    onChange={companyChange}
                                    onInputChange={companyOnInputChange}
                                    getOptionLabel={({ name }: Company) => name}
                                    getOptionValue={({ id }: Company) => id}
                                    menuPosition='fixed'
                                    menuShouldBlockScroll
                                    controlled
                                    error={touched.companyId
                                    && !searchCompanyInput
                                    && !searchCompanySuggestion
                                    && translations.requiredField}
                                    showErrorMessage
                                />
                            </Grid>
                            {!hideFields
                                ? <>
                                    <Grid item className={classes.inputWrapper}>
                                        <CRMInput
                                            fullWidth
                                            name='request_name'
                                            label={translations.requestName}
                                            onChange={nameChange}
                                            onBlur={nameBlur}
                                            value={values.name}
                                            error={touched.name && errors.name && translations.requiredName}
                                            InputLabelProps={{
                                                classes: { root: classes.label },
                                            }}
                                            showErrorMessage
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControl className={classes.datePiker}>
                                            <CRMDatePicker
                                                date={values.deadline}
                                                onChange={date => setFieldValue('deadline', date)}
                                                minDate={new Date()}
                                                withIcon
                                                fullWidth
                                                label={translations.deadline}
                                                clearable={false}
                                                InputProps={{
                                                    classes: { input: classes.dateInput },
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item container >
                                        <Grid item xs={3}>
                                            <Typography className={classes.priorityTitle}>{translations.priority}</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <FormControl>
                                                <RadioGroup
                                                    name='priority'
                                                    onChange={changePriority}
                                                    row
                                                >
                                                    {priorities.map(({ title, value }) => (
                                                        <FormControlLabel
                                                            key={title}
                                                            label={
                                                                <Typography className={classes.checkboxLabel}>
                                                                    {title}
                                                                </Typography>
                                                            }
                                                            value={value}
                                                            control={<CRMRadio checked={priority === value} />}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
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
                                            onChange={commentChange}
                                            onBlur={commentBlur}
                                            className={classes.commentField}
                                            rows={6}
                                            rowsMax={6}
                                        />
                                        <Typography
                                            className={cn(classes.commentMessage, { [classes.commentError]: errors.comment })}
                                            align='right'
                                        >
                                            {
                                                errors.comment
                                                || `${translations.numberOfCharacters} ${values.comment.length}/${MAX_INPUT_LENGTH}`
                                            }
                                        </Typography>
                                    </Grid>
                                    <SalesBlock
                                        salesList={sales}
                                        salesMessage={salesMessage}
                                        salesValue={values.sales}
                                        errors={touched.sales && errors.sales && translations.requiredField}
                                        handleChangeSale={event => setFieldValue('sales', event.target.value, true)}
                                    />
                                    <Grid item>
                                        <InputFile
                                            selectedFiles={selectedFiles}
                                            onChangeInputFile={changeInputFile}
                                            onDeleteFile={deleteFile}
                                            allFilesSize={allFilesSize}
                                        />
                                    </Grid>
                                </>
                                : <Typography
                                    variant='subtitle1'
                                    align='center'
                                    display='block'
                                    className={classes.errorRsponsibleMessage}
                                >
                                    {translations.responsibleRmErrorMessage}
                                </Typography>
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions classes={{ root: classes.dialogActionsBlock }}>
                        <Grid container justify='center'>
                            <Grid item className={classes.buttonContainer}>
                                <CRMButton
                                    size='small'
                                    variant='outlined'
                                    onClick={confirmationDialogOpen}
                                    disabled={disabled}
                                >
                                    {translations.cancel}
                                </CRMButton>
                            </Grid>
                            <Grid item className={classes.buttonContainer}>
                                <CRMButton
                                    primary
                                    type='submit'
                                    size='small'
                                    disabled={disabled || hideFields}
                                >
                                    {translations.save}
                                </CRMButton>
                            </Grid>
                        </Grid>
                        <CancelConfirmation
                            showConfirmationDialog={showConfirmationDialog}
                            onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                            onConfirm={onClose}
                            text={translations.areYouSureCV}
                        />
                    </DialogActions>
                </form>
                {loading && <CRMLoader />}
            </Grid>
        </Dialog>
    );
};

export default withStyles(styles)(MobileForm);
