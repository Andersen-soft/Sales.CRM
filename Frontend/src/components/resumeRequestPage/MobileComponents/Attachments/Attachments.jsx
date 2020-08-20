// @flow

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import GetApp from '@material-ui/icons/GetApp';
import {
    deleteAttachment,
    getAttachments,
} from 'crm-api/resumeRequestService/resumeRequestService';
import { downloadFile } from 'crm-api/downloadFile';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import Notification from 'crm-components/notification/NotificationSingleton';
import { useTranslation } from 'crm-hooks/useTranslation';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';

import styles from './AttachmentsStyles';

type Employee = {
    id: number,
    firstName: string,
    lastName: string,
}

type AttachmentType = {
    id: number,
    name: string,
    link: string,
    employee?: Employee,
    addedDate?: string,
}

type Props = {
    requestId: number,
    updateAttachment: boolean,
    setUpdateAttachment: (boolean) => void,
    setUpdateHistory: (boolean) => void,
    setAttachmentCount: (number) => void,
    classes: Object,
    setLoading: (key: string, status: boolean) => void,
};

const LOADING_KEY = 'attachments';

const Attachments = ({
    requestId,
    updateAttachment,
    setUpdateHistory,
    setUpdateAttachment,
    setAttachmentCount,
    classes,
    setLoading,
}: Props) => {
    const [attachments, setAttachments] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(null);

    const translations = {
        notificationDeleteAttachment: useTranslation('requestForCv.commentSection.attachmentsTab.notificationDeleteAttachment'),
        notificationErrorDeleteFile: useTranslation('requestForCv.commentSection.attachmentsTab.notificationErrorDeleteFile'),
        uploadedDate: useTranslation('requestForCv.mobile.uploadedDate'),
        download: useTranslation('common.download'),
        delete: useTranslation('common.delete'),
        userName: useTranslation('requestForCv.activityLogSection.userName'),
        notificationNoUploadedFiles: useTranslation('requestForCv.commentSection.attachmentsTab.notificationNoUploadedFiles'),
    };

    const fetchAttachments = async () => {
        setLoading(LOADING_KEY, true);
        try {
            const attachmentsList = await getAttachments(requestId);


            setAttachments(attachmentsList);
            setLoading(LOADING_KEY, false);
        } catch (err) {
            setLoading(LOADING_KEY, false);
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, []);

    useEffect(() => {
        setAttachmentCount(attachments.length);
    }, [attachments]);

    useEffect(() => {
        if (updateAttachment) {
            fetchAttachments();
            setUpdateAttachment(false);
        }
    }, [updateAttachment]);

    const removeAttachment = async (id: number) => {
        try {
            setLoading(LOADING_KEY, true);
            await deleteAttachment(requestId, id);
            setUpdateHistory(true);
            setAttachments(attachments.filter(attachment => attachment.id !== id));
            setLoading(LOADING_KEY, false);
        } catch {
            setLoading(LOADING_KEY, false);
            Notification.showMessage({
                message: translations.notificationErrorDeleteFile,
                closeTimeout: 15000,
            });
        }
    };

    const handleOnConfirm = () => {
        if (selectedAttachmentId) {
            removeAttachment(selectedAttachmentId);
        }

        setShowConfirmationDialog(false);
        setSelectedAttachmentId(null);
    };

    const handleDownLoad = async (id: number, name: string) => {
        const data = await downloadFile(id);

        saveAs(data, name);
    };

    const openConfirm = (id: number) => () => {
        setShowConfirmationDialog(true);
        setSelectedAttachmentId(id);
    };

    const getDotMenuConfig = ({ id, name }: AttachmentType) => [
        { icon: GetApp, text: translations.download, handler: () => handleDownLoad(id, name) },
        { icon: Delete, text: translations.delete, handler: openConfirm(id) },
    ];

    return <Grid className={classes.filesContainer}>
        {attachments.length
            ? attachments.map(({ id, link, name, addedDate, employee }) => <Grid
                key={id}
                className={classes.file}
            >
                <Typography className={classes.fileName}>{name}</Typography>
                <Typography className={classes.fileDate}>
                    <span className={classes.title}>{`${translations.uploadedDate}:`}</span>
                    {getDate(addedDate, FULL_DATE_CS)}
                </Typography>
                <Grid className={classes.user}>
                    <span className={classes.title}>{`${translations.userName}:`}</span>
                    <UserInformationPopover
                        userName={`${employee.firstName} ${employee.lastName}`}
                        userNameStyle={classes.userInformation}
                        userId={employee.id}
                        reloadParent={fetchAttachments}
                    />
                </Grid>
                <CRMDotMenu
                    className={classes.dotMenu}
                    config={getDotMenuConfig({ id, name, link })}
                />
            </Grid>)
            : <CRMEmptyBlock
                text={translations.notificationNoUploadedFiles}
                className={classes.emptyBlock}
            />}
        <CancelConfirmation
            showConfirmationDialog={showConfirmationDialog}
            onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
            onConfirm={handleOnConfirm}
            text={translations.notificationDeleteAttachment}
        />
    </Grid>;
};

export default withStyles(styles)(Attachments);
