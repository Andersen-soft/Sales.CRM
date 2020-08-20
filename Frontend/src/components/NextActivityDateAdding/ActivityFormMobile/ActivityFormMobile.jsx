// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import {
    COMMENTARY_ERROR,
    CONTACT_ERROR,
    TYPE_ACTIVITY_ERROR,
    ACTIVITY_DATE_ERROR,
} from 'crm-constants/desktop/errors';
import CRMFormControlCheckboxLabel from 'crm-components/crmUI/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMFormLabel from 'crm-ui/CRMFormLabel/CRMFormLabel';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMDateTimePicker from 'crm-ui/CRMDateTimePicker/CRMDateTimePicker';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMIcon from 'crm-icons';

import type { ActivityType } from 'crm-constants/NewActivityDateAdding/NewActivityDateAdding';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { StyledComponentProps } from '@material-ui/core/es';
import styles from './ActivityFormMobileStyles';

type Props = {
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
    isCheckedContacts: (index: number) => void,
    onHandleActivityDateChange: (date: ?Date) => void,
    onHandleNextActivityDateChange: (date: ?Date) => void,
    onHandleTypeCheck: (name: string) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleContactCheck: (id: ?number) => (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleCommentChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    onHandleCommentBlur: (event: SyntheticInputEvent<HTMLInputElement>) => void,
} & StyledComponentProps

const ActivityFormMobile = ({
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
    isCheckedContacts,
    onHandleActivityDateChange,
    onHandleNextActivityDateChange,
    onHandleTypeCheck,
    onHandleContactCheck,
    onHandleCommentChange,
    onHandleCommentBlur,
}: Props) => {
    const translations = {
        errorTypeActivity: useTranslation(TYPE_ACTIVITY_ERROR),
        errorContact: useTranslation(CONTACT_ERROR),
        errorComment: useTranslation(COMMENTARY_ERROR),
        errorActivityDate: useTranslation(ACTIVITY_DATE_ERROR),
    };

    return (
        <Dialog
            open={isDialogOpened}
            onClose={onHandleConfirmationDialogOpen}
            classes={{ paper: classes.container }}
        >
            <Grid>
                <DialogTitle classes={{ root: classes.withoutPadding }}>
                    <Grid
                        container
                        justify='flex-start'
                        alignItems='center'
                    >
                        <IconButton
                            className={classes.exitButton}
                            onClick={onHandleConfirmationDialogOpen}
                        >
                            <CRMIcon IconComponent={ArrowBackIos} />
                        </IconButton>
                        <Typography>Добавить активность</Typography>
                    </Grid>
                </DialogTitle>
                <DialogContent classes={{ root: classes.withoutPadding }}>
                    <Grid
                        container
                        direction='column'
                        justify='flex-start'
                        wrap='nowrap'
                        alignItems='stretch'
                    >
                        <Grid
                            item
                            className={classes.row}
                        >
                            <CRMFormLabel
                                className={classes.labelHeaderSection}
                                error={activityTypesError && translations.errorTypeActivity}
                            >
                                Тип Активности
                            </CRMFormLabel>
                            <Grid container>
                                {activityTypes.map(
                                    ({ name, activityTypeEnumCode, checked }) => (
                                        <Grid item xs={6} key={activityTypeEnumCode}>
                                            <CRMFormControlCheckboxLabel
                                                checkboxProps={{
                                                    checked,
                                                    onChange: onHandleTypeCheck(activityTypeEnumCode),
                                                    value: activityTypeEnumCode,
                                                }}
                                                label={name}
                                                labelClasses={{ label: classes.label }}
                                            />
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            className={classes.row}
                        >
                            <CRMFormLabel
                                className={classes.labelHeaderSection}
                                error={contactsError && translations.errorContact}
                            >
                                Контакт
                            </CRMFormLabel>
                            <Grid container>
                                {contacts.map(
                                    ({ name, id }, index) => (
                                        <Grid item xs={12} key={id}>
                                            <CRMFormControlCheckboxLabel
                                                checkboxProps={{
                                                    checked: isCheckedContacts(index),
                                                    onChange: onHandleContactCheck(id),
                                                    value: name,
                                                }}
                                                label={name}
                                                labelClasses={{ label: classes.label }}
                                            />
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            className={classes.row}
                        >
                            <CRMFormLabel
                                error={activityDateError && translations.errorActivityDate}
                                className={classes.labelHeaderSection}
                            >
                                Дата активности
                            </CRMFormLabel>
                            <Grid item xs={12}>
                                <CRMDateTimePicker
                                    value={activityDate}
                                    onChange={onHandleActivityDateChange}
                                    disableFuture
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            className={classes.row}
                        >
                            <CRMFormLabel
                                error={nextActivityDateError}
                                className={classes.labelHeaderSection}
                            >
                                Дата следующей активности
                            </CRMFormLabel>
                            <Grid item xs={12}>
                                <CRMDatePicker
                                    date={nextActivityDate}
                                    onChange={onHandleNextActivityDateChange}
                                    minDate={new Date()}
                                    clearable={false}
                                    fullWidth
                                    InputProps={{
                                        classes: { input: classes.dateInput },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            className={classes.row}
                        >
                            <CRMTextArea
                                fullWidth
                                label={
                                    <Typography className={classes.commentLabel}>
                                        Комментарий
                                    </Typography>
                                }
                                onChange={onHandleCommentChange}
                                onBlur={onHandleCommentBlur}
                                error={commentError && translations.errorComment}
                                rows={4}
                                rowsMax={4}
                                className={classes.commentField}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions classes={{ root: classes.dialogActionsBlock }}>
                    <Grid container justify='center'>
                        <Grid item className={classes.buttonContainer}>
                            <CRMButton onClick={onHandleConfirmationDialogOpen}>
                                Отмена
                            </CRMButton>
                        </Grid>
                        <Grid item>
                            <CRMButton
                                primary
                                onClick={validateDataForAdding}
                            >
                                Сохранить
                            </CRMButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Grid>
        </Dialog>
    );
};

export default withStyles(styles)(ActivityFormMobile);
