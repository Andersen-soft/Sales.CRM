// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { IconButton, Grid } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import AttachFile from '@material-ui/icons/AttachFile';
import CRMIcon from 'crm-ui/CRMIcons';
import { KB, MB, MAX_FILE_SIZE } from 'crm-constants/addResumeRequest/addResumeRequestConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './InputFileStyles';

type Props = {
    selectedFiles: Array<Object>,
    onChangeInputFile: (files: FileList) => void,
    classes: Object,
    onDeleteFile: (index: number) => void,
    allFilesSize: number,
}

const InputFile = ({
    selectedFiles,
    onChangeInputFile,
    classes,
    onDeleteFile,
    allFilesSize,
}: Props) => {
    const translations = {
        attachRequirements: useTranslation('header.modals.addRequest.attachRequirements'),
        mbLeftStart: useTranslation('header.modals.addRequest.mbLeftStart'),
        mbLeftEnd: useTranslation('header.modals.addRequest.mbLeftEnd'),
    };
    const addInputFile: {current: Object} = React.createRef();

    const handleChangeInputFile = ({ target: { files } }: SyntheticInputEvent<HTMLInputElement>) => {
        onChangeInputFile(files);
        addInputFile.current.value = '';
    };

    const formatFileSize = (size: number) => {
        switch (true) {
            case (size > MB):
                return `${(size / MB).toFixed(1)}MB`;
            case (size > KB):
                return `${(size / KB).toFixed(1)}KB`;
            default:
                return `${(size)}B`;
        }
    };

    return (
        <Grid container>
            <Grid item>
                <FormLabel htmlFor='addInputFile'>
                    <CRMIcon
                        IconComponent={AttachFile}
                        className={classes.attachButton}
                    />
                </FormLabel>
            </Grid>
            <Grid
                item
                className={classes.title}
            >
                <FormLabel className={classes.labelFile} htmlFor='addInputFile'>
                    {translations.attachRequirements}
                    <span className={classes.message}>
                        {`(${translations.mbLeftStart}${((MAX_FILE_SIZE - allFilesSize) / MB).toFixed()}${translations.mbLeftEnd})`}
                    </span>
                </FormLabel>
            </Grid>
            <Grid container>
                <Grid
                    container
                    item
                    xs={9}
                >
                    {selectedFiles.map(({ name, size }, index) =>
                        <Grid
                            container
                            className={classes.fileRow}
                            key={index}
                            direction='row'
                            justify='space-between'
                            alignItems='center'
                        >
                            <Grid item className={classes.files}>
                                {name}
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction='row'
                                    alignItems='center'
                                >
                                    <Grid item className={classes.files}>
                                        {formatFileSize(size)}
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            onClick={() => { onDeleteFile(index); }}
                                            className={classes.deleteButton}
                                        >
                                            <CRMIcon IconComponent={Close} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid>
                <input
                    ref={addInputFile}
                    name='selectedFiles'
                    onChange={handleChangeInputFile}
                    accept='.jpg,.png,.gif,.txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.odt,.odts,.odg,.odp'
                    id='addInputFile'
                    type='file'
                    className={classes.inputFile}
                    multiple
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(InputFile);
