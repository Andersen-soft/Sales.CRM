// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { isNil } from 'ramda';

import {
    Grid,
    Typography,
    RootRef,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import Send from '@material-ui/icons/Send';
import CRMIcon from 'crm-icons';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

import { COMMENT_TEXT_FIELD_ID, MAX_INPUT_LENGTH } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import styles from './CommentsEditMobileStyles';

type Props = {
    classes: Object,
    textInput: RootRef,
    key: any,
    message: string,
    editingCommentId: number | null,
    error: any | null,
    handleInputChange: () => void,
    handleInputKeyPress: () => void,
    handleCommentSend: () => void,
    translateEditComment: string,
    translateEnterComment: string,
    translateSend: string,
    translateSave: string,
    translateCharactersLeft: string,
}

const CommentsEditMobile = ({
    classes,
    textInput,
    key,
    message,
    editingCommentId,
    error,
    handleInputChange,
    handleInputKeyPress,
    handleCommentSend,
    translateEditComment,
    translateEnterComment,
    translateSend,
    translateSave,
    translateCharactersLeft,
}: Props) => (
    <Grid className={classes.container}>
        <Grid
            container
            wrap='nowrap'
            alignItems='flex-end'
            className={classes.inputWrapper}
        >
            <RootRef rootRef={textInput}>
                <CRMTextArea
                    key={key}
                    value={message}
                    onChange={handleInputChange}
                    fullWidth
                    onKeyDown={handleInputKeyPress}
                    rowsMax={3}
                    label={!isNil(editingCommentId) ? translateEditComment : translateEnterComment}
                    id={COMMENT_TEXT_FIELD_ID}
                    classes={{
                        label: classes.inputLabel,
                        input: classes.inputTextarea,
                    }}
                />
            </RootRef>
            <Tooltip title={isNil(editingCommentId) ? translateSend : translateSave}>
                <IconButton
                    onClick={handleCommentSend}
                    classes={{ root: classes.rootIcon }}
                >
                    <CRMIcon IconComponent={Send} />
                </IconButton>
            </Tooltip>
        </Grid>
        <Grid>
            <Typography
                className={cn(classes.message, { [classes.messageError]: error })}
                align='left'
            >
                { error || `${translateCharactersLeft}: ${MAX_INPUT_LENGTH - message.length}`}
            </Typography>
        </Grid>
    </Grid>
);

export default withStyles(styles)(CommentsEditMobile);
