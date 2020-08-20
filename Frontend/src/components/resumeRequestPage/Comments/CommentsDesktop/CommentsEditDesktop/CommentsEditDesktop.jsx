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

import styles from './CommentsEditDesktopStyles';

type Props = {
    classes: Object,
    loading: boolean,
    textInput: RootRef,
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

const CommentsEditDesktop = ({
    classes,
    loading,
    textInput,
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
    <Grid
        className={classes.container}
        direction='column'
        container
        justify='flex-end'
    >
        <Grid item className={classes.inputWrapper}>
            <RootRef rootRef={textInput}>
                <CRMTextArea
                    value={message}
                    onChange={handleInputChange}
                    fullWidth
                    onKeyDown={handleInputKeyPress}
                    rows={3}
                    rowsMax={3}
                    label={!isNil(editingCommentId) ? translateEditComment : translateEnterComment}
                    id={COMMENT_TEXT_FIELD_ID}
                    classes={{
                        label: classes.inputLabel,
                        input: classes.inputTextarea,
                    }}
                    className={classes.commentField}
                />
            </RootRef>
            <Tooltip title={isNil(editingCommentId) ? translateSend : translateSave}>
                <IconButton
                    onClick={handleCommentSend}
                    className={!message.trim().length || loading ? classes.hidden : ''}
                    classes={{ root: classes.rootIcon }}
                >
                    <CRMIcon IconComponent={Send} />
                </IconButton>
            </Tooltip>
        </Grid>
        <Grid item className={classes.bottomRow}>
            <Typography
                className={cn(classes.message, { [classes.messageError]: error })}
                align='left'
            >
                { error || `${translateCharactersLeft}: ${MAX_INPUT_LENGTH - message.length}`}
            </Typography>
        </Grid>
    </Grid>
);

export default withStyles(styles)(CommentsEditDesktop);
