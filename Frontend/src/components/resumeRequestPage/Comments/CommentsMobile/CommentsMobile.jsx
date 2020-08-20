// @flow

import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, RootRef } from '@material-ui/core';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CommentsEditMobile from './CommentsEditMobile';
import CommentsList from '../CommentsList/CommentsList';

import styles from './CommentsMobileStyles';

type Props = {
    classes: Object,
    loading: boolean,
    comments: Array<any>,
    userId: number,
    textInput: RootRef,
    key: any,
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

const CommentsMobile = ({
    classes,
    loading,
    comments,
    userId,
    textInput,
    key,
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

    return (
        <Grid
            container
            className={classes.container}
            wrap='nowrap'
            direction='column'
        >
            {useMemoWrapper(<CommentsList
                comments={comments}
                handleCommentEdit={handleCommentEdit}
                handleCommentDeleteInitiated={handleCommentDeleteInitiated}
                userId={userId}
                getCommentsUpdate={getCommentsUpdate}
                loading={loading}
            />, [comments, loading])}
            <CommentsEditMobile
                textInput={textInput}
                key={key}
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
    );
};

export default withStyles(styles)(CommentsMobile);
