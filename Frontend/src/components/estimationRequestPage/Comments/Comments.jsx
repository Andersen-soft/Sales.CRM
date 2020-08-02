// @flow

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { isNil, find, propEq, pipe } from 'ramda';
import cn from 'classnames';
import crmSocket, { SUBSCRIPTIONS_PAGE_KEYS as KEYS } from 'crm-helpers/api/crmSocket';
import { useTranslation } from 'crm-hooks/useTranslation';

import {
    Grid,
    Typography,
    Paper,
    RootRef,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import Send from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import styles from './CommentsStyles';

import CRMIcon from 'crm-icons';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import Notification from 'crm-components/notification/NotificationSingleton';
import CommentsList from './CommentsList';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';

import {
    MAX_INPUT_LENGTH,
    ADD_OR_UPDATE_COMMENT_MESSAGE,
    DELETE_COMMENT_MESSAGE,
} from 'crm-constants/estimationRequestPage/commentsConstants';
import { COMMENT_TEXT_FIELD_ID } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

import {
    fetchComments,
    deleteComment,
    editComment,
    addComment,
} from 'crm-api/estimationRequestPageService/comments';

import { fetchHistory as featchHistoryAction } from 'crm-actions/estimationRequestActions/historyActions';

import type { Person } from 'crm-types/allResumeRequests';

export type Comment = {
    id: number,
    employee: Person,
    createDate: string,
    description: string,
    isEdited: boolean,
};

type Props = {
    classes: Object,
    estimationId: number,
    userId: number,
    fetchHistory: (number) => void,
}

const Comments = ({
    classes,
    estimationId,
    userId,
    fetchHistory,
}: Props) => {
    const [comments, setComments] = useState([]);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [error, setError] = useState(null);
    const textInput = useRef(null);

    const translations = {
        save: useTranslation('common.save'),
        send: useTranslation('common.send'),
        errorMaxNumOfChars: useTranslation('forms.errorMaxNumOfChars'),
        errorDeleteComment: useTranslation('requestForEstimation.estimationSection.commentsTab.errorDeleteComment'),
        errorAddComment: useTranslation('requestForEstimation.estimationSection.commentsTab.errorAddComment'),
        errorUpdateComment: useTranslation('requestForEstimation.estimationSection.commentsTab.errorUpdateComment'),
        editComment: useTranslation('requestForEstimation.estimationSection.commentsTab.editComment'),
        enterComment: useTranslation('requestForEstimation.estimationSection.commentsTab.enterComment'),
        charactersLeft: useTranslation('requestForEstimation.estimationSection.commentsTab.charactersLeft'),
        notificationDeleteComment: useTranslation('requestForEstimation.estimationSection.commentsTab.notificationDeleteComment'),
    };

    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    const getComments = async () => {
        setLoading(true);

        const commentsData = await fetchComments(estimationId);

        setComments(commentsData);
        setLoading(false);
    };

    const onUpdateComments = messageData => {
        const newComment = JSON.parse(messageData.body);

        if (newComment.requestId !== Number(estimationId)) {
            return;
        }

        setComments(currentComments => {
            if (currentComments.find(({ id }) => id === newComment.id)) {
                return currentComments.map(comment => ((comment.id === newComment.id) ? newComment : comment));
            }

            return [...currentComments, newComment];
        });

        fetchHistory(estimationId);
    };

    const onDeleteComment = messageData => {
        const { commentId, requestId } = JSON.parse(messageData.body);

        if (requestId !== Number(estimationId)) {
            return;
        }

        setComments(currentComments => currentComments.filter(({ id }) => id !== commentId));

        fetchHistory(estimationId);
    };

    useEffect(() => {
        getComments();

        crmSocket.subscribe(ADD_OR_UPDATE_COMMENT_MESSAGE, onUpdateComments, KEYS.EstimationRequestComment);
        crmSocket.subscribe(DELETE_COMMENT_MESSAGE, onDeleteComment, KEYS.EstimationRequestComment);

        crmSocket.activate();

        return () => crmSocket.deactivate(KEYS.EstimationRequestComment);
    }, []);

    const setCommentFocus = () => {
        const { current } = textInput;

        if (current) {
            current.querySelector(`#${COMMENT_TEXT_FIELD_ID}`).focus();
        }
    };

    useEffect(() => {
        message && setCommentFocus();
    });

    const getCommentsUpdate = user => {
        if (user) {
            const { id, firstName, lastName } = user;

            const updatedComments = comments.map(comment => (comment.employee.id === id
                ? { ...comment, employee: { ...comment.employee, firstName, lastName } }
                : comment));

            setComments(updatedComments);
        }
    };

    const handleCommentEdit = (commentId: number) => {
        const editingComment = find(propEq('id', commentId), comments);

        if (!isNil(editingComment)) {
            setEditingCommentId(commentId);
            setMessage(editingComment.description);
            setError(null);
        }
    };

    const handleCommentDeleteInitiated = (commentId: number) => setDeletingCommentId(commentId);

    const handleCommentDeleteAborted = () => setDeletingCommentId(null);

    const handleCommentDeleteConfirmed = async () => {
        if (deletingCommentId) {
            setLoading(true);

            try {
                await deleteComment(estimationId, deletingCommentId);
                fetchHistory(estimationId);
                setComments(comments.filter(({ id }) => id !== deletingCommentId));
                setLoading(false);
            } catch {
                Notification.showMessage({
                    message: translations.errorDeleteComment,
                    closeTimeout: 15000,
                });
                setLoading(false);
            }
        }
        setDeletingCommentId(null);
    };

    const handleInputChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        let newMessage = value;
        let localError: string | null = null;

        if (value.length > MAX_INPUT_LENGTH) {
            newMessage = value.slice(0, MAX_INPUT_LENGTH);
            localError = translations.errorMaxNumOfChars;
        }

        setMessage(newMessage);
        setError(localError);
    };

    const isMessageValid = ():boolean => !!message.trim().length && message.trim().length <= MAX_INPUT_LENGTH;

    const saveNewComment = async () => {
        setLoading(true);

        try {
            const response = await addComment(estimationId, message);

            fetchHistory(estimationId);

            setComments([...comments, response]);
            setMessage('');
            setError(null);
            setLoading(false);
        } catch {
            Notification.showMessage({
                message: translations.errorAddComment,
                closeTimeout: 15000,
            });
            setLoading(false);
        }
    };

    const saveChangedComment = async () => {
        if (editingCommentId && find(propEq('id', editingCommentId), comments).description === message) {
            setMessage('');
            setEditingCommentId(null);
            setError(null);

            return;
        }

        if (editingCommentId) {
            setLoading(true);

            try {
                const response = await editComment(estimationId, editingCommentId, message);

                const updatedComments = comments.map(comment => {
                    if (comment.id === editingCommentId) {
                        return response;
                    }

                    return comment;
                });

                fetchHistory(estimationId);

                setComments(updatedComments);
                setMessage('');
                setEditingCommentId(null);
                setError(null);
                setLoading(false);
            } catch {
                Notification.showMessage({
                    message: translations.errorUpdateComment,
                    closeTimeout: 15000,
                });
                setLoading(false);
            }
        }
    };

    const handleCommentSend = () => {
        if (loading || !isMessageValid()) {
            return;
        }

        editingCommentId
            ? saveChangedComment()
            : saveNewComment();
    };

    const handleInputKeyPress = ({ key, ctrlKey }) => {
        if (key === 'Enter' && ctrlKey) {
            handleCommentSend();
        }
    };

    const renderEditBlock = () => (
        <>
            <Grid
                className={classes.inputWrapper}
                item
                xs={12}
            >
                <RootRef rootRef={textInput}>
                    <CRMTextArea
                        value={message}
                        onChange={handleInputChange}
                        fullWidth
                        onKeyDown={handleInputKeyPress}
                        rows={3}
                        rowsMax={3}
                        label={!isNil(editingCommentId) ? translations.editComment : translations.enterComment}
                        id={COMMENT_TEXT_FIELD_ID}
                        classes={{
                            label: classes.inputLabel,
                            input: classes.inputTextArea,
                        }}
                    />
                </RootRef>
                <Tooltip title={isNil(editingCommentId) ? translations.send : translations.save}>
                    <IconButton
                        onClick={handleCommentSend}
                        className={!message.trim().length || loading ? classes.hidden : ''}
                        classes={{ root: classes.iconRoot }}
                    >
                        <CRMIcon IconComponent={Send} />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid
                item
                xs={12}
                container
                direction='row'
                wrap='nowrap'
                alignItems='center'
                className={classes.bottomRow}
            >
                <Grid
                    item
                    container
                    alignItems='center'
                    xs={9}
                >
                    <Typography
                        className={cn(classes.commentMessage, { [classes.commentError]: error })}
                        align='left'
                    >
                        { error || `${translations.charactersLeft}: ${MAX_INPUT_LENGTH - message.length}`}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );

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
                classes={classes}
                comments={comments}
                onCommentEdit={handleCommentEdit}
                onCommentDelete={handleCommentDeleteInitiated}
                userId={userId}
                reloadComments={getCommentsUpdate}
            />, [comments, loading])}
            <Grid
                className={classes.editBlock}
                container
                direction='column'
                wrap='nowrap'
                justify='flex-end'
                item
                xs={12}
            >
                {renderEditBlock()}
            </Grid>
            <CancelConfirmation
                showConfirmationDialog={!!deletingCommentId}
                onConfirmationDialogClose={handleCommentDeleteAborted}
                onConfirm={handleCommentDeleteConfirmed}
                text={translations.notificationDeleteComment}
            />
        </Grid>
    </Paper>;
};

const mapStateToProps = ({ session: { userData: { id } } }) => ({
    userId: id,
});

const mapDispatchToProps = { fetchHistory: featchHistoryAction };

const compose = pipe(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
);

export default compose(Comments);
