// @flow

import React, { useState, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'ramda';
import {
    Typography,
    Paper,
    Tooltip,
    IconButton,
    Grid,
    Divider,
    FormLabel,
    RootRef,
} from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { Delete, GetApp } from '@material-ui/icons';
import { saveAs } from 'file-saver';
import DragnDropIcon from 'crm-static/customIcons/dragndrop.svg';

import {
    getAttachments,
    deleteAttachment,
    addAttachment,
} from 'crm-api/resumeRequestService/resumeRequestService';
import { downloadFile } from 'crm-api/downloadFile';
import { TABLE_COLUMN_KEYS, MAX_FILE_SIZE } from 'crm-constants/resumeRequestPage/attachmentConstants';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { AVAILABLE_FILE_TYPES } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { File } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import Notification from 'crm-components/notification/NotificationSingleton';
import ResumeCustomTooltip from 'crm-components/common/ResumeCustomTooltip';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { UserCell } from 'crm-components/common/TableCells';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from 'crm-components/resumeRequestPage/Attachment/AttachmentStyles';

type Employee = {
    id: number,
    firstName: string,
    lastName: string,
}

type AttachmentType = {
    id: number,
    name: string,
    employee: Employee,
    addedDate: string,
}

type Props = {
    classes: Object;
    requestResumeId: number,
    setAttachmentCount: (number) => void,
    setUpdateHistory: (boolean) => void,
};

const Attachment = ({
    classes,
    requestResumeId,
    setAttachmentCount,
    setUpdateHistory,
}: Props) => {
    const [attachments, setAttachments] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(null);
    const [loading, setLoading] = useState(false);

    const translations = {
        file: useTranslation('requestForCv.commentSection.attachmentsTab.file'),
        user: useTranslation('requestForCv.commentSection.attachmentsTab.user'),
        dateUpload: useTranslation('requestForCv.commentSection.attachmentsTab.dateUpload'),
        downloadAttachment: useTranslation('requestForCv.commentSection.attachmentsTab.downloadAttachment'),
        deleteAttachment: useTranslation('requestForCv.commentSection.attachmentsTab.deleteAttachment'),
        addFile: useTranslation('requestForCv.commentSection.attachmentsTab.addFile'),
        notificationFileSizeLimit: useTranslation('requestForCv.commentSection.attachmentsTab.notificationFileSizeLimit'),
        notificationFileUploadError: useTranslation('requestForCv.commentSection.attachmentsTab.notificationFileUploadError'),
        notificationDragFileHere: useTranslation('requestForCv.commentSection.attachmentsTab.notificationDragFileHere'),
        notificationDragFile: useTranslation('requestForCv.commentSection.attachmentsTab.notificationDragFile'),
        notificationDeleteAttachment: useTranslation('requestForCv.commentSection.attachmentsTab.notificationDeleteAttachment'),
        notificationErrorDeleteFile: useTranslation('requestForCv.commentSection.attachmentsTab.notificationErrorDeleteFile'),
        notificationNoUploadedFiles: useTranslation('requestForCv.commentSection.attachmentsTab.notificationNoUploadedFiles'),
    };

    const inputFile: {current: Object} = useRef(null);

    const fetchAttachments = async () => {
        setLoading(true);
        try {
            const attachmentsList = await getAttachments(requestResumeId);

            setAttachments(attachmentsList);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, []);

    useEffect(() => {
        setAttachmentCount(attachments.length);
    }, [attachments]);

    const getFileName = ({ name }: AttachmentType) => <Tooltip
        title={<ResumeCustomTooltip name={name} />}
        disableFocusListener
    >
        <Grid className={classes.fileLink}>
            {name}
        </Grid>
    </Tooltip>;

    const validateFiles = files => {
        const filesSize = files.reduce((sum, { size }) => sum + size, 0);

        if (filesSize > MAX_FILE_SIZE) {
            Notification.showMessage({
                message: translations.notificationFileSizeLimit,
                closeTimeout: 15000,
            });
            return false;
        }

        return true;
    };

    const handleUpload = async files => {
        if (validateFiles(files)) {
            try {
                setLoading(true);
                const request = await addAttachment(requestResumeId, files);
                const newAttachments = Array.isArray(request) ? request : [request];

                setAttachments([...newAttachments, ...attachments]);
                setUpdateHistory(true);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                Notification.showMessage({
                    message: translations.notificationFileUploadError,
                    closeTimeout: 15000,
                });
            }
        }
    };

    const handleConfirmationDialogClose = () => setShowConfirmationDialog(false);

    const removeAttachment = async (id: number) => {
        try {
            setLoading(true);
            await deleteAttachment(requestResumeId, id);
            setUpdateHistory(true);
            setAttachments(attachments.filter(attachment => attachment.id !== id));
            setLoading(false);
        } catch (e) {
            setLoading(false);
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

    const handleDownLoadResume = async (file: File) => {
        const fileData = await downloadFile(file.id);

        saveAs(fileData, file.name);
    };

    const openConfirm = (id: number) => {
        setShowConfirmationDialog(true);
        setSelectedAttachmentId(id);
    };

    const renderActionCell = (attachment: AttachmentType) => (
        <>
            <Tooltip title={translations.downloadAttachment}>
                <IconButton
                    className={classes.icons}
                    onClick={() => handleDownLoadResume(attachment)}
                >
                    <GetApp />
                </IconButton>
            </Tooltip>
            <Tooltip title={translations.deleteAttachment}>
                <IconButton
                    className={classes.icons}
                    onClick={() => { openConfirm(attachment.id); }}
                >
                    <Delete />
                </IconButton>
            </Tooltip>
        </>
    );

    const prepareData = rawAttachment => rawAttachment.map(attachment => ({
        id: attachment.id,
        file: getFileName(attachment),
        user: {
            name: `${pathOr('', ['employee', 'firstName'], attachment)} ${pathOr('', ['employee', 'lastName'], attachment)}`,
            id: pathOr(null, ['employee', 'id'], attachment),
            reloadParent: fetchAttachments,
        },
        addDate: getDate(attachment.addedDate, FULL_DATE_CS),
        actions: renderActionCell(attachment),
    }));

    const config = [
        {
            title: translations.file,
            key: TABLE_COLUMN_KEYS.FILE,
            visible: true,
        },
        {
            title: translations.user,
            key: TABLE_COLUMN_KEYS.USER,
            visible: true,
            RenderCell: UserCell,
        },
        {
            title: translations.dateUpload,
            key: TABLE_COLUMN_KEYS.ADD_DATE,
            visible: true,
        },
        {
            title: '',
            key: TABLE_COLUMN_KEYS.ACTIONS,
            visible: true,
        },
    ];

    return (
        <Paper classes={{ root: classes.paperRoot }} className={classes.cardWrap}>
            <Grid
                container
                className={classes.container}
                wrap='nowrap'
                direction='column'
            >
                <Grid
                    className={classes.attachment}
                    item
                    xs={12}
                >
                    <Dropzone noClick onDrop={acceptedFiles => handleUpload(acceptedFiles)}>
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <section className={classes.dropZoneContainer}>
                                <div {...getRootProps({ className: classes.dropZoneContainer })}>
                                    <RootRef rootRef={inputFile}>
                                        <input
                                            name='selectedFiles'
                                            id='inputFileDrop'
                                            accept={AVAILABLE_FILE_TYPES}
                                            {...getInputProps()}
                                        />
                                    </RootRef>
                                    {isDragActive
                                        ? (
                                            <Grid
                                                container
                                                className={classes.dropZone}
                                                justify='center'
                                                alignItems='center'
                                            >
                                                <DragnDropIcon />
                                                {translations.notificationDragFileHere}
                                            </Grid>
                                        ) : (
                                            <CRMTable
                                                data={prepareData(attachments)}
                                                columnsConfig={config}
                                                isLoading={loading}
                                                rowHover
                                                errorMessage={translations.notificationNoUploadedFiles}
                                                cellClasses={{
                                                    addDate: classes.date,
                                                    actions: classes.actionsCell,
                                                }}
                                                classes={{ title: classes.titleCell }}
                                            />
                                        )
                                    }
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Grid>
                <Grid
                    className={classes.buttonWrapper}
                    container
                    direction='column'
                    wrap='nowrap'
                    justify='flex-end'
                    item
                    xs={12}
                >
                    <Divider classes={{ root: classes.divider }} />
                    <Grid
                        container
                        justify='flex-end'
                        alignItems='center'
                    >
                        <Typography
                            variant='subtitle1'
                            color='textSecondary'
                            className={classes.title}
                        >
                            {translations.notificationDragFile}
                        </Typography>
                        <FormLabel
                            className={classes.labelFile}
                            htmlFor='inputFileDrop'
                        >
                            <CRMButton
                                variant='contained' primary
                                component='span'
                            >
                                {translations.addFile}
                            </CRMButton>
                        </FormLabel>
                    </Grid>
                </Grid>
            </Grid>
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={handleConfirmationDialogClose}
                onConfirm={handleOnConfirm}
                text={translations.notificationDeleteAttachment}
            />
        </Paper>
    );
};

export default withStyles(styles)(Attachment);
