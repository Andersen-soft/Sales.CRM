// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, DialogTitle, IconButton, Dialog,
} from '@material-ui/core';
import cn from 'classnames';
import { Close } from '@material-ui/icons';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMIcon from 'crm-icons';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import Notification from 'crm-components/notification/NotificationSingleton';
import { fetchUsersByRole, getStatuses } from 'crm-api/resumeRequestService/resumeRequestService';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { userRoles } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { employeeRespEntityToAvaliableHr, getMessageFromError } from './utils';

import type {
    ResumeItem,
    NewResume,
    AutoCompleteType,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './ResumeModalStyles';

type Props = {
    classes: Object,
    requestResumeId: number,
    onModalToggle: () => void,
    createResume: (number, NewResume) => Promise<ResumeItem>,
    setUpdateHistory: boolean => void,
    open: boolean,
    setResumeTab?: () => void,
} & StyledComponentProps

const ResumeModal = ({
    classes,
    onModalToggle,
    requestResumeId,
    createResume,
    setUpdateHistory,
    open,
    setResumeTab,
}: Props) => {
    const [fullName, setFullName] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [availableHRs, setAvailableHRs] = useState([]);
    const [selectedHRid, setSelectedHRid] = useState(null);
    const [fullNameErr, setFullNameErr] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const translations = {
        addApplicant: useTranslation('requestForCv.modalAddApplicant.addApplicant'),
        fullName: useTranslation('requestForCv.modalAddApplicant.fullName'),
        fullNameEnter: useTranslation('requestForCv.modalAddApplicant.fullNameEnter'),
        status: useTranslation('requestForCv.modalAddApplicant.status'),
        responsibleHR: useTranslation('requestForCv.modalAddApplicant.responsibleHR'),
        notificationCancelAdding: useTranslation('requestForCv.modalAddApplicant.notificationCancelAdding'),
        cancel: useTranslation('common.cancel'),
        add: useTranslation('common.add'),
        errorInputRequired: useTranslation('forms.errorInputRequired'),
        errorMaxNumOfChars: useTranslation('forms.errorMaxNumOfChars'),
    };

    const isMobile = useMobile();

    const fetchStatusesAvailableHRs = async () => {
        try {
            const [allStatuses, allAvailableHRs] = await Promise.all([getStatuses(), fetchUsersByRole(userRoles.HR)]);
            const allowableStatuses = allStatuses.slice(1);

            setStatuses(allowableStatuses);
            setSelectedStatus(allowableStatuses[1]);
            setAvailableHRs(allAvailableHRs.content.map(employeeRespEntityToAvaliableHr));
        } catch (err) {
            Notification.showMessage({
                message: getMessageFromError(err),
                closeTimeout: 15000,
            });
        }
    };

    useEffect(() => {
        fetchStatusesAvailableHRs();
    }, []);

    const getStatusesMenuItems = () => statuses.map(status => ({
        value: status,
        label: status,
    }));

    const getHRsMenuItems = () => availableHRs.map(hr => ({
        value: hr.id,
        label: hr.printName,
    }));

    const validateFullNameField = () => {
        if (!fullName) {
            setFullNameErr(translations.errorInputRequired);
            return false;
        }
        return true;
    };

    const handleFullNameInputChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length <= 100) {
            setFullNameErr(null);
            setFullName(value);
        } else {
            setFullName(value.slice(0, 100));
            setFullNameErr(translations.errorMaxNumOfChars);
        }
    };

    const handleStatusChange = ({ value }) => setSelectedStatus(value);

    const handleHRsChange = (hr: AutoCompleteType) => setSelectedHRid(hr && hr.value);

    const resetState = () => {
        setButtonDisable(false);
        setFullName('');
        setSelectedStatus(statuses[1]);
        setSelectedHRid(null);
    };

    const handleSubmit = () => {
        if (!validateFullNameField() || !selectedStatus) {
            return;
        }

        setButtonDisable(true);

        createResume(requestResumeId, {
            fullName,
            responsibleHrid: selectedHRid || null,
            status: selectedStatus,
            files: [],
        })
            .then(() => {
                setUpdateHistory(true);
                onModalToggle();
                resetState();

                setResumeTab && setResumeTab();
            })
            .catch(err => {
                setButtonDisable(false);
                Notification.showMessage({
                    message: getMessageFromError(err),
                    closeTimeout: 15000,
                });
                onModalToggle();
            });
    };

    const toggleConfirm = () => setShowConfirmationDialog(!showConfirmationDialog);

    const handleClose = () => {
        onModalToggle();
        toggleConfirm();
    };


    return (
        <Dialog
            open={open}
            onClose={onModalToggle}
            classes={{ paper: cn(classes.dialogContainer, { [classes.mobileDialogContainer]: isMobile }) }}
            fullScreen={isMobile}
        >
            <Paper elevation={isMobile ? 0 : 1}>
                <Grid
                    item
                    container
                    direction='column'
                    justify='center'
                    alignItems='stretch'
                    className={cn(classes.dialog, { [classes.mobileDialog]: isMobile })}
                >
                    <DialogTitle classes={{ root: classes.title }}>
                        <Grid
                            container
                            justify='space-between'
                        >
                            {translations.addApplicant}
                            <IconButton
                                className={classes.exitButton}
                                onClick={toggleConfirm}
                            >
                                <CRMIcon IconComponent={Close} />
                            </IconButton>
                        </Grid>
                    </DialogTitle>
                    <Grid
                        item
                        className={classes.row}
                    >
                        <CRMInput
                            onChange={handleFullNameInputChange}
                            value={fullName}
                            label={translations.fullName}
                            error={fullNameErr}
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.row}
                    >
                        <CRMAutocompleteSelect
                            options={getStatusesMenuItems()}
                            label={translations.status}
                            value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                            onChange={handleStatusChange}
                            controlled
                            menuPosition={'fixed'}
                            menuShouldBlockScroll
                            isClearable={false}
                            isSearchable={!isMobile}
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.row}
                    >
                        <CRMAutocompleteSelect
                            options={getHRsMenuItems()}
                            onChange={handleHRsChange}
                            label={translations.responsibleHR}
                            menuPosition={'fixed'}
                            menuShouldBlockScroll
                            maxMenuHeight={isMobile ? 200 : null}
                            isSearchable={!isMobile}
                        />
                    </Grid>
                    <Grid
                        className={classes.buttonsContainer} container
                        direction='row' justify='center'
                    >
                        <CRMButton
                            className={classes.button}
                            onClick={toggleConfirm}
                            size='large'
                        >
                            {translations.cancel}
                        </CRMButton>
                        <CRMButton
                            primary className={classes.button}
                            onClick={handleSubmit} disabled={buttonDisable}
                            size='large'
                        >
                            {translations.add}
                        </CRMButton>
                    </Grid>
                </Grid>
                <CancelConfirmation
                    showConfirmationDialog={showConfirmationDialog}
                    onConfirmationDialogClose={toggleConfirm}
                    onConfirm={handleClose}
                    text={translations.notificationCancelAdding}
                    textAlignCenter
                />
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(ResumeModal);
