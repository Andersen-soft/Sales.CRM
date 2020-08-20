// @flow

import React, { useRef } from 'react';
import {
    IconButton,
    Tooltip,
    FormLabel,
    Grid,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { GetApp, Close, Add } from '@material-ui/icons';
import { saveAs } from 'file-saver';
import head from 'ramda/src/head';
import { useTranslation } from 'crm-hooks/useTranslation';
import Notification from 'crm-components/notification/NotificationSingleton';
import { downloadFile } from 'crm-api/downloadFile';
import { AVAILABLE_FILE_TYPES } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import { MAX_FILE_SIZE } from 'crm-constants/resumeRequestPage/attachmentConstants';

import type { StyledComponentProps } from '@material-ui/core/es';
import type { File } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import styles from './cellsStyles';

type Props = {
    values: [
        number,
        Array<File>,
        (id: number, fileId: number) => void,
        (number, File, number) => void,
        number,
        (boolean) => void,
    ],
} & StyledComponentProps;

const FilesCell = ({
    values: [
        id,
        files,
        openConfirmDeleteResumeFile,
        addAttachment,
        requestResumeId,
        setUpdateHistory,
    ],
    classes,
}: Props) => {
    const translations = {
        addFile: useTranslation('requestForCv.cvSection.addFile'),
        downloadCv: useTranslation('requestForCv.cvSection.downloadCv'),
        deleteCv: useTranslation('requestForCv.cvSection.deleteCv'),
        maxSizeOfFiles: useTranslation('requestForCv.cvSection.maxSizeOfFiles'),
    };

    const inputFile: { current: Object } = useRef(null);

    const handleDownLoadResume = async (file: File) => {
        const fileData = await downloadFile(file.id);

        saveAs(fileData, file.name);
    };

    const validateInputFile = ({ size }) => {
        if (size > MAX_FILE_SIZE) {
            Notification.showMessage({
                message: translations.maxSizeOfFiles,
                closeTimeout: 15000,
            });
            return false;
        }

        return true;
    };

    const onChangeInputFile = async (fileId, { target: { files: filesList } }) => {
        if (validateInputFile(filesList[0])) {
            await addAttachment(fileId, head(filesList), requestResumeId);
            setUpdateHistory(true);
        }

        inputFile.current.value = '';
    };

    return (
        <Grid>
            {files.map(file => (
                <Grid key={file.id} className={classes.fileWrapper}>
                    <Tooltip title={translations.downloadCv}>
                        <IconButton onClick={() => handleDownLoadResume(file)}>
                            <GetApp />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.deleteCv}>
                        <IconButton onClick={() => openConfirmDeleteResumeFile(id, file.id)}>
                            <Close />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title={file.name}
                        interactive
                        placement='bottom-start'
                    >
                        <Typography
                            variant='body2'
                            className={classes.ellipsis}
                        >
                            {file.name}
                        </Typography>
                    </Tooltip>
                </Grid>
            ))}
            <Grid className={classes.addFile}>
                <input
                    ref={inputFile}
                    name='selectedFile'
                    onChange={event => onChangeInputFile(id, event)}
                    accept={AVAILABLE_FILE_TYPES}
                    id={`resumeFile${id}`}
                    type='file'
                    className={classes.inputFile}
                />
                <FormLabel
                    className={classes.labelFile}
                    htmlFor={`resumeFile${id}`}
                >
                    {translations.addFile}
                    <Add />
                </FormLabel>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(FilesCell);
