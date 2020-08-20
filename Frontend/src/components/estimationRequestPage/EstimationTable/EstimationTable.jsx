// @flow

import React, { useState, useEffect } from 'react';
import { head, pathOr } from 'ramda';
import { saveAs } from 'file-saver';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'crm-hooks/useTranslation';

import {
    Paper,
    Grid,
    Typography,
    Tooltip,
    IconButton,
    FormLabel,
    Divider,
} from '@material-ui/core';
import { Delete, GetApp } from '@material-ui/icons';
import DragnDropIcon from 'crm-static/customIcons/dragndrop.svg';

import Notification from 'crm-components/notification/NotificationSingleton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import ResumeCustomTooltip from 'crm-components/common/ResumeCustomTooltip';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { UserCell } from 'crm-components/common/TableCells';

import { AVAILABLE_FILE_TYPES } from 'crm-constants/estimationRequestPage/estimationTable';
import { TABLE_COLUMN_KEYS, MAX_FILE_SIZE } from 'crm-constants/estimationRequestPage/attachmentConstants';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import type { File, Employee } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';

import { downloadFile } from 'crm-api/downloadFile';
import { getDate } from 'crm-utils/dates';

import { withStyles } from '@material-ui/core/styles';
import styles from '../FilesTableStyles';

export type EstimationType = {
    id: number,
    name: string,
    link: string,
    employee: Employee,
    addedDate: string,
}

type Props = {
    estimationId: number,
    classes: Object,
    fetchHistory: (number) => void,
    fetchEstimations: (number) => void,
    addEstimation: (number, File) => void,
    deleteEstimation: (estimationId: number, id: number) => void,
    estimations: Array<EstimationType>,
    loading: boolean,
};

type AttachmentType = {
    id: number,
    name: string,
    link: string,
    employee: Employee,
    addedDate: string,
}

const EstimationTable = ({
    estimationId,
    classes,
    fetchHistory,
    fetchEstimations,
    addEstimation,
    deleteEstimation,
    estimations,
    loading,
}: Props) => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(null);

    const translations = {
        file: useTranslation('requestForEstimation.estimationSection.attachmentsTab.file'),
        user: useTranslation('requestForEstimation.estimationSection.attachmentsTab.user'),
        dateUpload: useTranslation('requestForEstimation.estimationSection.attachmentsTab.dateUpload'),
        notificationFileSizeLimit: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationFileSizeLimit'),
        notificationFileUploadError: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationFileUploadError'),
        notificationDragFile: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationDragFile'),
        addFile: useTranslation('requestForEstimation.estimationSection.attachmentsTab.addFile'),
        notificationDragFileHere: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationDragFileHere'),
        notificationDeleteAttachment: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationDeleteAttachment'),
        downloadAttachment: useTranslation('requestForEstimation.estimationSection.attachmentsTab.downloadAttachment'),
        deleteAttachment: useTranslation('requestForEstimation.estimationSection.attachmentsTab.deleteAttachment'),
        notificationNoUploadedFiles: useTranslation('requestForEstimation.estimationSection.attachmentsTab.notificationNoUploadedFiles'),
        noResultsFoundText: useTranslation('requestForEstimation.estimationSection.estimationsTab.noResultsFoundText'),
    };

    const getEstimation = async () => {
        await fetchEstimations(estimationId);
    };

    useEffect(() => {
        getEstimation();
    }, []);

    const handleOnConfirm = () => {
        if (selectedAttachmentId) {
            deleteEstimation(estimationId, selectedAttachmentId);
        }

        setShowConfirmationDialog(false);
        setSelectedAttachmentId(null);
    };

    const handleConfirmationDialogClose = () => setShowConfirmationDialog(false);

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
                addEstimation(estimationId, head(files));
            } catch (e) {
                Notification.showMessage({
                    message: translations.notificationFileUploadError,
                    closeTimeout: 15000,
                });
            }
        }
    };

    const handleDownLoadEstimate = async (file: File) => {
        const fileData = await downloadFile(file.id);

        saveAs(fileData, file.name);
    };

    const openConfirm = (id: number) => {
        setShowConfirmationDialog(true);
        setSelectedAttachmentId(id);
    };

    const getFileName = ({ name }: AttachmentType) => <Tooltip
        title={<ResumeCustomTooltip name={name} />}
        disableFocusListener
    >
        <Grid className={classes.fileLink}>{name}</Grid>
    </Tooltip>;

    const renderActionCell = (attachment: AttachmentType) => (
        <>
            <Tooltip title={translations.downloadAttachment}>
                <IconButton
                    className={classes.icons}
                    onClick={() => handleDownLoadEstimate(attachment)}
                >
                    <GetApp />
                </IconButton>
            </Tooltip>
            <Tooltip title={translations.deleteAttachment}>
                <IconButton
                    className={classes.icons}
                    onClick={() => openConfirm(attachment.id)}
                >
                    <Delete />
                </IconButton>
            </Tooltip>
        </>
    );

    const renderTable = () => {
        const prepareData = rawAttachment => rawAttachment.map(attachment => ({
            id: attachment.id,
            file: getFileName(attachment),
            user: {
                name: `${pathOr('', ['employee', 'firstName'], attachment)} ${pathOr('', ['employee', 'lastName'], attachment)}`,
                id: pathOr(null, ['employee', 'id'], attachment),
                reloadParent: getEstimation,
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
            <CRMTable
                data={prepareData(estimations)}
                columnsConfig={config}
                isLoading={loading}
                rowHover
                errorMessage={translations.notificationNoUploadedFiles}
                cellClasses={{
                    addDate: classes.date,
                    actions: classes.actionsCell,
                }}
                classes={{ title: classes.titleCell }}
                noResultsFoundText={translations.noResultsFoundText}
            />
        );
    };

    const renderFileLoader = () => (
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
                    htmlFor='estimationFile'
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
    );

    return (
        <Paper
            classes={{ root: classes.paperRoot }}
            className={classes.cardWrap}
        >
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
                                    <input
                                        name='estimationsFile'
                                        id='estimationFile'
                                        accept={AVAILABLE_FILE_TYPES}
                                        {...getInputProps()}
                                    />
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
                                        ) : renderTable()
                                    }
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Grid>
                {renderFileLoader()}
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

export default withStyles(styles)(EstimationTable);
