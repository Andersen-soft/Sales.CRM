// @flow

import React, { useState, useEffect } from 'react';
import { Modal, Paper, Grid, Typography, IconButton } from '@material-ui/core';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Delete from '@material-ui/icons/Delete';
import GetApp from '@material-ui/icons/GetApp';
import CRMIcon from 'crm-icons';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { useTranslation } from 'crm-hooks/useTranslation';
import { saveAs } from 'file-saver';
import { downloadFile } from 'crm-api/downloadFile';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';

import type { Resume } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

type Props = {
    requestId: number,
    open: boolean,
    closeWindow: () => void,
    resume: Resume | null,
    classes: Object,
    deleteAttachment: (resumeId: number, fileId: number, requestId: number) => void,
    setUpdateHistory: (boolean) => void,
};

const ResumeAttachment = ({
    open,
    requestId,
    resume,
    closeWindow,
    classes,
    deleteAttachment,
    setUpdateHistory,
}: Props) => {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [localResume, setLoaclResume]: [Resume | null, Function] = useState(null);

    useEffect(() => {
        setLoaclResume(resume);
    }, [resume]);

    const translations = {
        notificationDeleteFile: useTranslation('requestForCv.cvSection.notificationDeleteFile'),
        download: useTranslation('common.download'),
        delete: useTranslation('common.delete'),
        attachedFilesToResume: useTranslation('requestForCv.mobile.attachedFilesToResume'),
        uploadedDate: useTranslation('requestForCv.mobile.uploadedDate'),
        notificationNoUploadedFiles: useTranslation('requestForCv.commentSection.attachmentsTab.notificationNoUploadedFiles'),
    };

    const deleteFile = () => {
        if (localResume && selectedFileId) {
            deleteAttachment(localResume.id, selectedFileId, requestId);
            setUpdateHistory(true);

            setLoaclResume({
                ...localResume,
                files: localResume.files.filter(({ id }) => id !== selectedFileId),
            });
        }

        setSelectedFileId(null);
        setShowConfirmationModal(false);
    };

    const handleDownLoadResume = async (id, name) => {
        const data = await downloadFile(id);

        saveAs(data, name);
    };

    const showConfirmDialog = (fileId: number) => () => {
        setSelectedFileId(fileId);
        setShowConfirmationModal(true);
    };

    const getDotMenuConfig = ({ id, name }) => [
        { icon: GetApp, text: translations.download, handler: () => handleDownLoadResume(id, name) },
        { icon: Delete, text: translations.delete, handler: showConfirmDialog(id) },
    ];

    return localResume && <Modal
        open={open}
        onClose={closeWindow}
        BackdropProps={{ invisible: true }}
    >
        <Paper
            elevation={0}
            className={classes.resumeAttachmentsContainer}
        >
            <Grid className={classes.scrollContainer}>
                <Grid
                    container
                    justify='flex-start'
                    alignItems='center'
                    className={classes.attachmentTitleRow}
                >
                    <IconButton
                        className={classes.exitButton}
                        onClick={closeWindow}
                    >
                        <CRMIcon IconComponent={ArrowBackIos} />
                    </IconButton>
                    <Typography className={classes.attachmentsTitle}>{translations.attachedFilesToResume}</Typography>
                </Grid>
                <Typography className={classes.name}>
                    {localResume.fio}
                </Typography>
                <Grid className={classes.filesContainer}>
                    {localResume.files.length
                        ? localResume.files.map(({ id, name, addedDate }) => <Grid
                            key={id}
                            className={classes.file}
                        >
                            <Typography className={classes.fileName}>{name}</Typography>
                            <Typography className={classes.fileDate}>
                                <span className={classes.title}>{`${translations.uploadedDate}:`}</span>
                                {getDate(addedDate, FULL_DATE_CS)}
                            </Typography>
                            <CRMDotMenu
                                className={classes.dotMenu}
                                config={getDotMenuConfig({ id, name })}
                            />
                        </Grid>)
                        : <CRMEmptyBlock
                            text={translations.notificationNoUploadedFiles}
                            className={classes.emptyBlock}
                        />}
                </Grid>
                <CancelConfirmation
                    showConfirmationDialog={showConfirmationModal}
                    onConfirmationDialogClose={() => setShowConfirmationModal(false)}
                    onConfirm={deleteFile}
                    text={translations.notificationDeleteFile}
                />
            </Grid>
        </Paper>
    </Modal>;
};

export default ResumeAttachment;
