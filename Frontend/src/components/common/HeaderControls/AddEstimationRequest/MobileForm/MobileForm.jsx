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
import { ArrowBackIos } from '@material-ui/icons';
import { MAX_INPUT_LENGTH } from 'crm-constants/addResumeRequest/addResumeRequestConstants';
import CRMIcon from 'crm-icons';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import InputFile from 'crm-components/common/InputFile';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import SalesBlock from '../../AddRequestCommon/SalesBlock/SalesBlock';

import type { FormikProps } from 'crm-types/formik';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { Company } from '../AddEstimationRequest';

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
}: Props) => (
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
                        <Typography>Добавление запроса на оценку</Typography>
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
                                label='Название компании'
                                loadOptions={debounceHandleSearch}
                                onChange={companyChange}
                                getOptionLabel={({ name }: Company) => name}
                                getOptionValue={({ id }: Company) => id}
                                menuPosition='fixed'
                                menuShouldBlockScroll
                                controlled
                                error={touched.companyId && !searchCompanySuggestion}
                            />
                        </Grid>
                        <Grid item className={classes.inputWrapper}>
                            <CRMInput
                                fullWidth
                                name='name'
                                label='Название запроса'
                                onChange={nameChange}
                                onBlur={nameBlur}
                                value={values.name}
                                error={touched.name && errors.name}
                                InputLabelProps={{
                                    classes: { root: classes.label },
                                }}
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
                                    label='Дедлайн'
                                    clearable={false}
                                    InputProps={{
                                        classes: { input: classes.dateInput },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <CRMTextArea
                                fullWidth
                                name='comment'
                                value={values.comment}
                                label={
                                    <Typography className={classes.commentLabel}>
                                        Комментарий
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
                                    || `Количество символов ${values.comment.length}/${MAX_INPUT_LENGTH}`
                                }
                            </Typography>
                        </Grid>
                        <SalesBlock
                            salesList={sales}
                            salesMessage={salesMessage}
                            salesValue={values.sales}
                            errors={touched.sales && errors.sales}
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
                <DialogActions classes={{ root: classes.dialogActionsBlock }}>
                    <Grid container justify='center'>
                        <Grid item className={classes.buttonContainer}>
                            <CRMButton
                                onClick={confirmationDialogOpen}
                                disabled={disabled}
                            >
                                Отменить
                            </CRMButton>
                        </Grid>
                        <Grid item className={classes.buttonContainer}>
                            <CRMButton
                                primary
                                type='submit'
                                size='small'
                                disabled={disabled}
                            >
                                Применить
                            </CRMButton>
                        </Grid>
                    </Grid>
                    <CancelConfirmation
                        showConfirmationDialog={showConfirmationDialog}
                        onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                        onConfirm={onClose}
                        text='Вы уверены, что хотите отменить создание запроса на оценку?'
                    />
                </DialogActions>
            </form>
            {loading && <CRMLoader />}
        </Grid>
    </Dialog>
);

export default withStyles(styles)(MobileForm);
