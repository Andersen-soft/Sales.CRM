// @flow

import React from 'react';

import cn from 'classnames';
import { COMMENTARY_ERROR, CONTACT_ERROR, TYPE_ACTIVITY_ERROR, ACTIVITY_DATE_ERROR } from 'crm-constants/desktop/errors';
import CRMFormControlCheckboxLabel from 'crm-components/crmUI/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMTextAreaBlock from 'crm-components/common/CRMTextAreaBlock/CRMTextAreaBlock';
import CRMIcon from 'crm-icons';
import CRMFormLabel from 'crm-ui/CRMFormLabel/CRMFormLabel';
import CRMDateTimePicker from 'crm-ui/CRMDateTimePicker/CRMDateTimePicker';
import { CRM_DATETIME_FORMAT_DOTS } from 'crm-constants/dateFormat';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormGroup, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import type { ActivityType } from 'crm-constants/NewActivityDateAdding/NewActivityDateAdding';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';
import styles from './ActivityFormDesktopStyles';

type Props = {
    classes: Object,
    isDialogOpened: boolean,
    contactsError: boolean,
    activityTypesError: boolean,
    activityDateError: boolean,
    nextActivityDateError: boolean,
    commentError: boolean,
    activityDate: string,
    nextActivityDate: Date,
    activityTypes: ActivityType,
    contacts: Array<{ id: number, name: string, checked: boolean }>,
    onHandleConfirmationDialogOpen: () => void,
    validateDataForAdding: () => void,
    getRowsCountDependingOnContacts: () => number,
    isCheckedContacts: (index: number) => void,
    onHandleActivityDateChange: (date: ?Date) => void,
    onHandleNextActivityDateChange: (date: ?Date) => void,
    onHandleTypeCheck: (name: string) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleContactCheck: (id: ?number) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleCommentChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleCommentBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
}

const ActivityFormDesktop = ({
    classes,
    isDialogOpened,
    contactsError,
    activityTypesError,
    activityDateError,
    nextActivityDateError,
    commentError,
    activityDate,
    nextActivityDate,
    activityTypes,
    contacts,
    onHandleConfirmationDialogOpen,
    validateDataForAdding,
    getRowsCountDependingOnContacts,
    isCheckedContacts,
    onHandleActivityDateChange,
    onHandleNextActivityDateChange,
    onHandleTypeCheck,
    onHandleContactCheck,
    onHandleCommentChange,
    onHandleCommentBlur,
}: Props) => {
    const translations = {
        addActivity: useTranslation('desktop.addActivity.addActivity'),
        typeOfActivity: useTranslation('desktop.addActivity.typeOfActivity'),
        contact: useTranslation('desktop.addActivity.contact'),
        dateOfActivity: useTranslation('desktop.addActivity.dateOfActivity'),
        dateOfNextActivity: useTranslation('desktop.addActivity.dateOfNextActivity'),
        comment: useTranslation('desktop.addActivity.comment'),
        commentPlaceholder: useTranslation('desktop.addActivity.commentPlaceholder'),
        cancel: useTranslation('common.cancel'),
        save: useTranslation('common.save'),
        errorTypeActivity: useTranslation(TYPE_ACTIVITY_ERROR),
        errorContact: useTranslation(CONTACT_ERROR),
        errorComment: useTranslation(COMMENTARY_ERROR),
        errorActivityDate: useTranslation(ACTIVITY_DATE_ERROR),
    };

    return (
        <Dialog
            open={isDialogOpened}
            scroll='paper'
            maxWidth='md'
            PaperProps={{
                classes: {
                    root: classes.root,
                },
            }}
            fullWidth
        >
            <DialogTitle
                className={classes.title}
                disableTypography
            >
                <Grid
                    container
                    alignItems='center'
                    justify='flex-start'
                >
                    {translations.addActivity}
                </Grid>
                <IconButton
                    aria-label='Close'
                    className={classes.closeButton}
                    onClick={onHandleConfirmationDialogOpen}
                >
                    <CRMIcon IconComponent={CloseIcon} />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.noPadding}>
                <Grid
                    container
                    wrap='nowrap'
                >
                    <Grid
                        item
                        container
                        xs={6}
                    >
                        <Grid item xs={6}>
                            <FormControl required>
                                <FormGroup
                                    row
                                    className={classes.activityContainer}
                                >
                                    <Grid item xs={12}>
                                        <CRMFormLabel
                                            className={classes.typeActivityLabel}
                                            error={activityTypesError && translations.errorTypeActivity}
                                        >
                                            {translations.typeOfActivity}
                                        </CRMFormLabel>
                                    </Grid>
                                    <Grid item xs>
                                        <FormGroup>
                                            {activityTypes.map(
                                                ({ name, activityTypeEnumCode, checked }) => (
                                                    <CRMFormControlCheckboxLabel
                                                        key={activityTypeEnumCode}
                                                        checkboxProps={{
                                                            checked,
                                                            onChange: onHandleTypeCheck(activityTypeEnumCode),
                                                            value: activityTypeEnumCode,
                                                        }}
                                                        labelClasses={{ label: classes.checkboxLabel }}
                                                        label={name}
                                                    />
                                                ),
                                            )}
                                        </FormGroup>
                                    </Grid>
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl required>
                                <FormGroup
                                    row
                                    className={classes.activityContainer}
                                >
                                    <Grid item xs={12}>
                                        <CRMFormLabel
                                            className={classes.typeActivityLabel}
                                            error={contactsError && translations.errorContact}
                                        >
                                            {translations.contact}
                                        </CRMFormLabel>
                                    </Grid>
                                    <Grid item xs>
                                        <FormGroup>
                                            {contacts.map(
                                                ({ name, id }, index) => (
                                                    <CRMFormControlCheckboxLabel
                                                        key={id}
                                                        checkboxProps={{
                                                            checked: isCheckedContacts(index),
                                                            onChange: onHandleContactCheck(id),
                                                            value: name,
                                                        }}
                                                        label={name}
                                                        labelClasses={{
                                                            label: classes.checkboxLabel,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </FormGroup>
                                    </Grid>
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            className={classes.activityDateBlock}
                        >
                            <FormControl required>
                                <FormGroup
                                    row
                                    className={classes.activityContainer}
                                >
                                    <Grid
                                        item
                                        classes={{ item: classes.gridItem }}
                                        xs={12}
                                    >
                                        <CRMFormLabel
                                            error={activityDateError && translations.errorActivityDate}
                                            className={classes.typeActivityLabel}
                                        >
                                            {translations.dateOfActivity}
                                        </CRMFormLabel>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CRMDateTimePicker
                                            value={activityDate}
                                            onChange={onHandleActivityDateChange}
                                            InputProps={{
                                                classes: {
                                                    root: classes.dateRoot,
                                                    input: classes.dateInput,
                                                },
                                            }}
                                            disableFuture
                                            format={CRM_DATETIME_FORMAT_DOTS}
                                            withIcon
                                        />
                                    </Grid>
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            className={classes.nextActivityBlock}
                        >
                            <FormGroup row>
                                <Grid item xs={12}>
                                    <CRMFormLabel
                                        error={nextActivityDateError}
                                        className={classes.typeActivityLabel}
                                    >
                                        {translations.dateOfNextActivity}
                                    </CRMFormLabel>
                                </Grid>
                                <Grid item xs={12}>
                                    <CRMDatePicker
                                        date={nextActivityDate}
                                        onChange={onHandleNextActivityDateChange}
                                        minDate={new Date()}
                                        clearable={false}
                                        InputProps={{
                                            classes: {
                                                root: classes.dateRoot,
                                                input: classes.dateInput,
                                            },
                                        }}
                                        withIcon
                                    />
                                </Grid>
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <CRMTextAreaBlock
                            required
                            fullWidth
                            error={commentError && translations.errorComment}
                            headerText={translations.comment}
                            textAreaProps={{
                                rows: getRowsCountDependingOnContacts(),
                                rowsMax: getRowsCountDependingOnContacts(),
                                placeholder: translations.commentPlaceholder,
                                onChange: onHandleCommentChange,
                                onBlur: onHandleCommentBlur,
                                classes: {
                                    inputElementRoot: classes.comment,
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Grid container justify='center'>
                    <CRMButton
                        onClick={onHandleConfirmationDialogOpen}
                        className={classes.confirmationButton}
                        size='large'
                    >
                        {translations.cancel}
                    </CRMButton>
                    <CRMButton
                        onClick={validateDataForAdding}
                        variant='action'
                        className={cn(classes.saveBtn, classes.confirmationButton)}
                        size='large'
                    >
                        {translations.save}
                    </CRMButton>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(ActivityFormDesktop);
