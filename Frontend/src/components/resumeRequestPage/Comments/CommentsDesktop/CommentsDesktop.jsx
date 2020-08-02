// @flow

import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, RootRef } from '@material-ui/core';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CommentsList from '../CommentsList/CommentsList';
import CommentsEditDesktop from './CommentsEditDesktop';

import styles from './CommentsDesktopStyles';

type Props = {
    classes: Object,
    loading: boolean,
    comments: Array<any>,
    userId: number,
    textInput: RootRef,
    message: string,
    editingCommentId: number | null,
    error: any | null,
    deletingCommentId: number | null,
    handleInputChange: () => void,
    handleInputKeyPress: () => void,
    handleCommentSend: () => void,
    handleCommentEdit: (commentId: number) => void,
    handleCommentDeleteInitiated: (commentId: number) => void,
    getCommentsUpdate: () => void,
    handleCommentDeleteAborted: () => void,
    handleCommentDeleteConfirmed: () => void,
    translateNotificationDeleteComment: string,
    translateEditComment: string,
    translateEnterComment: string,
    translateSend: string,
    translateSave: string,
    translateCharactersLeft: string,
}

const CommentsDesktop = ({
    classes,
    loading,
    comments,
    userId,
    textInput,
    message,
    editingCommentId,
    error,
    deletingCommentId,
    handleInputChange,
    handleInputKeyPress,
    handleCommentSend,
    handleCommentEdit,
    handleCommentDeleteInitiated,
    getCommentsUpdate,
    handleCommentDeleteAborted,
    handleCommentDeleteConfirmed,
    translateNotificationDeleteComment,
    translateEditComment,
    translateEnterComment,
    translateSend,
    translateSave,
    translateCharactersLeft,
}: Props) => {
    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    return <Paper
        elevation={0}
        classes={{ root: classes.paperRoot }}
    >
        <Grid
            container
            className={classes.container}
            wrap='nowrap'
            direction='column'
        >
            {useMemoWrapper(<CommentsList
                loading={loading}
                comments={comments}
                handleCommentEdit={handleCommentEdit}
                handleCommentDeleteInitiated={handleCommentDeleteInitiated}
                userId={userId}
                getCommentsUpdate={getCommentsUpdate}
            />, [comments, loading])}
            <CommentsEditDesktop
                loading={loading}
                textInput={textInput}
                message={message}
                editingCommentId={editingCommentId}
                error={error}
                handleInputChange={handleInputChange}
                handleInputKeyPress={handleInputKeyPress}
                handleCommentSend={handleCommentSend}
                translateEditComment={translateEditComment}
                translateEnterComment={translateEnterComment}
                translateSend={translateSend}
                translateSave={translateSave}
                translateCharactersLeft={translateCharactersLeft}
            />
            <CancelConfirmation
                showConfirmationDialog={!!deletingCommentId}
                onConfirmationDialogClose={handleCommentDeleteAborted}
                onConfirm={handleCommentDeleteConfirmed}
                text={translateNotificationDeleteComment}
            />
        </Grid>
    </Paper>;
};

export default withStyles(styles)(CommentsDesktop);
