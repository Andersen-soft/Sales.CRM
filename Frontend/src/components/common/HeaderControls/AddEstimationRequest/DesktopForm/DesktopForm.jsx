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
    Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { MAX_INPUT_LENGTH } from 'crm-constants/addResumeRequest/addResumeRequestConstants';
import CRMIcon from 'crm-icons';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { useTranslation } from 'crm-hooks/useTranslation';
import InputFile from 'crm-components/common/InputFile';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import type { FormikProps } from 'crm-types/formik';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { Company } from '../AddEstimationRequest';

import SalesBlock from '../../AddRequestCommon/SalesBlock/SalesBlock';

import styles from '../../AddRequestCommon/DesktopFormStyles';

type Props = {
    open: boolean,
    confirmationDialogOpen: () => void,
    submit: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    debounceHandleSearch: () => void,
    companyChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    searchCompanySuggestion: Company | null,
    nameChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    nameBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
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
} & StyledComponentProps & FormikProps;

const DesctopForm = ({
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
    nameBlur,
    setFieldValue,
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
}: Props) => {
    const translations = {
        addRequestForEstimation: useTranslation('header.modals.addRequest.addRequestForEstimation'),
        companyName: useTranslation('header.modals.addRequest.companyName'),
        requestName: useTranslation('header.modals.addRequest.requestName'),
        deadline: useTranslation('header.modals.addRequest.deadline'),
        comment: useTranslation('header.modals.addRequest.comment'),
        numberOfCharacters: useTranslation('header.modals.addRequest.numberOfCharacters'),
        cancel: useTranslation('header.modals.addRequest.cancel'),
        save: useTranslation('header.modals.addRequest.save'),
        areYouSureEstimation: useTranslation('header.modals.addRequest.areYouSureEstimation'),
        requiredField: useTranslation('header.modals.addRequest.requiredField'),
        requiredName: useTranslation(errors.name),
    };

    return (
        <Dialog
            open={open}
            onClose={confirmationDialogOpen}
            classes={{ paper: classes.container }}
        >
            <div className={classes.wrapper}>
                <form onSubmit={submit}>
                    <DialogTitle
                        classes={{ root: classes.title }}
                        disableTypography
                    >
                        <Grid
                            container
                            justify='space-between'
                        >
                            {translations.addRequestForEstimation}
                            <IconButton
                                className={classes.exitButton}
                                onClick={confirmationDialogOpen}
                            >
                                <CRMIcon IconComponent={Close} />
                            </IconButton>
                        </Grid>
                    </DialogTitle>
                    <DialogContent classes={{ root: classes.content }}>
                        <Grid
                            container
                            direction='row'
                            justify='space-between'
                            spacing={5}
                        >
                            <Grid
                                container
                                item
                                xs={6}
                                direction='column'
                                justify='flex-start'
                                alignItems='stretch'
                            >
                                <Grid
                                    item
                                    className={cn(classes.fullWidth, classes.inputWrapper)}
                                >
                                    <CRMAutocompleteSelect
                                        cacheOptions
                                        async
                                        value={searchCompanySuggestion}
                                        label={translations.companyName}
                                        loadOptions={debounceHandleSearch}
                                        onChange={companyChange}
                                        getOptionLabel={({ name }: Company) => name}
                                        getOptionValue={({ id }: Company) => id}
                                        controlled
                                        error={touched.companyId && !searchCompanySuggestion && translations.requiredField}
                                    />
                                </Grid>
                                <Grid item className={classes.inputWrapper}>
                                    <CRMInput
                                        fullWidth
                                        name='name'
                                        label={translations.requestName}
                                        onChange={nameChange}
                                        onBlur={nameBlur}
                                        value={values.name}
                                        InputLabelProps={{
                                            classes: { root: classes.label },
                                        }}
                                        error={touched.name && errors.name && translations.requiredName}
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
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6} sm={6}
                                lg={6} xl={6}
                                direction='column'
                                justify='flex-start'
                                alignItems='stretch'
                            >
                                <Grid
                                    item
                                    className={classes.fullWidth}
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
                                        onChange={commentChange}
                                        onBlur={commentBlur}
                                        className={cn(classes.commentField, classes.bigCommentField)}
                                        rows={10}
                                        rowsMax={10}
                                    />
                                    <Typography
                                        className={cn(classes.commentMessage, { [classes.commentError]: errors.comment })}
                                        align='left'
                                    >
                                        {
                                            errors.comment
                                            || `${translations.numberOfCharacters} ${values.comment.length}/${MAX_INPUT_LENGTH}`
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction='column'
                            justify='flex-start'
                        >
                            <SalesBlock
                                salesList={sales}
                                salesMessage={salesMessage}
                                salesValue={values.sales}
                                isCompany={!!values.companyId}
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
                        </Grid>
                    </DialogContent>
                    <DialogActions className={classes.dialogActions}>
                        <Grid
                            container
                            justify='center'
                            spacing={5}
                        >
                            <Grid item>
                                <CRMButton
                                    onClick={confirmationDialogOpen}
                                    disabled={disabled}
                                    size='large'
                                >
                                    {translations.cancel}
                                </CRMButton>
                            </Grid>
                            <Grid item >
                                <CRMButton
                                    primary
                                    type='submit'
                                    disabled={disabled}
                                    size='large'
                                >
                                    {translations.save}
                                </CRMButton>
                            </Grid>
                        </Grid>
                        <CancelConfirmation
                            showConfirmationDialog={showConfirmationDialog}
                            onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                            onConfirm={onClose}
                            text={translations.areYouSureEstimation}
                        />
                    </DialogActions>
                </form>
                {loading && <CRMLoader />}
            </div>
        </Dialog>
    );
};

export default withStyles(styles)(DesctopForm);
