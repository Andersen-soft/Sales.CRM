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
import { Close } from '@material-ui/icons';
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

import type { FormikProps } from 'crm-types/formik';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { Company } from '../AddresumeRequest';

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
    companyOnInputChange?: () => void,
    searchCompanyInput?: string,
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
    changePriority,
    priorities,
    priority,
    commentChange,
    companyOnInputChange,
    searchCompanyInput,
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
                            {translations.addRequestForCv}
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
                                xs={6} sm={6}
                                lg={6} xl={6}
                                direction='column'
                                justify='flex-start'
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
                                        onInputChange={companyOnInputChange}
                                        getOptionLabel={({ name }: Company) => name}
                                        getOptionValue={({ id }: Company) => id}
                                        controlled
                                        error={touched.companyId
                                        && !searchCompanyInput
                                        && !searchCompanySuggestion
                                        && translations.requiredField}
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
                                <Grid item className={classes.fullWidth}>
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
                                xs={6}
                                direction='column'
                                justify='flex-start'
                                alignItems='stretch'
                            >
                                <Grid
                                    item
                                    container
                                    justify='space-between'
                                    className={classes.priorityRow}
                                >
                                    <Grid item xs={3}>
                                        <Typography className={classes.priorityTitle}>{translations.priority}</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <FormControl>
                                            <RadioGroup
                                                name='priority'
                                                onChange={changePriority}
                                                row
                                            >
                                                {priorities.map(({ title, value }) => (
                                                    <FormControlLabel
                                                        key={title}
                                                        label={<Typography className={classes.checkboxLabel}>
                                                            {title}
                                                        </Typography>}
                                                        value={value}
                                                        control={<CRMRadio checked={priority === value} />}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    className={classes.fullWidth}
                                >
                                    <CRMTextArea
                                        fullWidth
                                        name='comment'
                                        value={values.comment}
                                        label={<Typography className={classes.commentLabel}>
                                            {translations.comment}
                                        </Typography>}
                                        onChange={commentChange}
                                        onBlur={commentBlur}
                                        className={classes.commentField}
                                        rows={5}
                                        rowsMax={5}
                                    />
                                    <Typography
                                        className={cn(classes.commentMessage, { [classes.commentError]: errors.comment })}
                                        align='left'
                                    >
                                        {errors.comment
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
                            <Grid item>
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
                            text={translations.areYouSureCV}
                            textAlignCenter
                        />
                    </DialogActions>
                </form>
                {loading && <CRMLoader />}
            </div>
        </Dialog>
    );
};

export default withStyles(styles)(DesctopForm);
