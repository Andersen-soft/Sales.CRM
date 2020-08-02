// @flow

import React, { useState, useEffect, useRef } from 'react';
import { isNil, find, propEq } from 'ramda';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';
import crmSocket, { SUBSCRIPTIONS_PAGE_KEYS as KEYS } from 'crm-helpers/api/crmSocket';

import {
    getComments as fetchComments,
    addComment,
    deleteComment,
    editComment,
} from 'crm-api/resumeRequestService/resumeRequestService';
import {
    COMMENT_TEXT_FIELD_ID,
    ADD_OR_UPDATE_COMMENT_MESSAGE,
    DELETE_COMMENT_MESSAGE,
    MAX_INPUT_LENGTH,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import Notification from 'crm-components/notification/NotificationSingleton';

import CommentsDesktop from './CommentsDesktop/CommentsDesktop';
import CommentsMobile from './CommentsMobile/CommentsMobile';

type Props = {
    classes: Object,
    requestResumeId: number,
    commentSubject: ?string,
    setUpdateHistory: (value: boolean) => void,
    userId: number,
};

const Comments = ({
    classes,
    requestResumeId,
    commentSubject,
    userId,
    setUpdateHistory,
}: Props) => {
    const [comments, setComments] = useState([]);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [error, setError] = useState(null);

    const textInput = useRef(null);

    const translations = {
        editComment: useTranslation('requestForCv.commentSection.commentsTab.editComment'),
        enterComment: useTranslation('requestForCv.commentSection.commentsTab.enterComment'),
        charactersLeft: useTranslation('requestForCv.commentSection.commentsTab.charactersLeft'),
        notificationDeleteComment: useTranslation('requestForCv.commentSection.commentsTab.notificationDeleteComment'),
        save: useTranslation('common.save'),
        send: useTranslation('common.send'),
        errorMaxNumOfChars: useTranslation('forms.errorMaxNumOfChars'),
        errorDeleteComment: useTranslation('requestForCv.commentSection.commentsTab.errorDeleteComment'),
        errorAddComment: useTranslation('requestForCv.commentSection.commentsTab.errorAddComment'),
        errorUpdateComment: useTranslation('requestForCv.commentSection.commentsTab.errorUpdateComment'),
    };

    const getComments = async () => {
        setLoading(true);

        const { content } = await fetchComments(requestResumeId);

        setLoading(false);
        setComments(content);
    };

    const onUpdateComments = async socetMessage => {
        const newComment = JSON.parse(socetMessage.body);

        if (newComment.requestId !== Number(requestResumeId)) {
            return;
        }

        setComments(currentComments => {
            if (currentComments.find(({ id }) => id === newComment.id)) {
                return currentComments.map(comment => ((comment.id === newComment.id) ? newComment : comment));
            }

            return [...currentComments, newComment];
        });

        setUpdateHistory(true);
    };

    const onDeleteComment = async socetMessage => {
        const { commentId, requestId } = JSON.parse(socetMessage.body);

        if (requestId !== Number(requestResumeId)) {
            return;
        }

        setComments(currentComments => currentComments.filter(({ id }) => id !== commentId));

        setUpdateHistory(true);
    };

    useEffect(() => {
        getComments();

        crmSocket.subscribe(ADD_OR_UPDATE_COMMENT_MESSAGE, onUpdateComments, KEYS.ResumeRequestComment);
        crmSocket.subscribe(DELETE_COMMENT_MESSAGE, onDeleteComment, KEYS.ResumeRequestComment);

        crmSocket.activate();

        return () => crmSocket.deactivate(KEYS.ResumeRequestComment);
    }, []);

    const setCommentFocus = () => {
        const { current } = textInput;

        if (current) {
            current.querySelector(`#${COMMENT_TEXT_FIELD_ID}`).focus();
        }
    };

    useEffect(() => {
        if (commentSubject) {
            setMessage(`${commentSubject}: `);
            setCommentFocus();
        }
    }, [commentSubject]);

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
            setDeletingCommentId(null);

            try {
                await deleteComment(requestResumeId, deletingCommentId);

                setUpdateHistory(true);
                setLoading(false);
                setComments(comments.filter(({ id }) => id !== deletingCommentId));
            } catch {
                Notification.showMessage({
                    message: translations.errorDeleteComment,
                    closeTimeout: 15000,
                });
                setLoading(false);
            }
        }
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
            const response = await addComment(requestResumeId, message);

            setUpdateHistory(true);
            setLoading(false);
            setComments([...comments, response]);
            setMessage('');
            setError(null);
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
                const response = await editComment(requestResumeId, editingCommentId, message);

                const updatedComments = comments.map(comment => {
                    if (comment.id === editingCommentId) {
                        return response;
                    }

                    return comment;
                });

                setUpdateHistory(true);
                setLoading(false);
                setComments(updatedComments);
                setMessage('');
                setEditingCommentId(null);
                setError(null);
            } catch (err) {
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

    const handleInputKeyPress = ({ key: keyData, ctrlKey }) => {
        if (keyData === 'Enter' && ctrlKey) {
            handleCommentSend();
        }
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? CommentsMobile : CommentsDesktop;

    return (
        <SectionLayout
            loading={loading}
            comments={comments}
            userId={userId}
            textInput={textInput}
            message={message}
            editingCommentId={editingCommentId}
            error={error}
            deletingCommentId={deletingCommentId}
            handleInputChange={handleInputChange}
            handleInputKeyPress={handleInputKeyPress}
            handleCommentSend={handleCommentSend}
            handleCommentEdit={handleCommentEdit}
            handleCommentDeleteInitiated={handleCommentDeleteInitiated}
            getCommentsUpdate={getCommentsUpdate}
            handleCommentDeleteAborted={handleCommentDeleteAborted}
            handleCommentDeleteConfirmed={handleCommentDeleteConfirmed}
            translateNotificationDeleteComment={translations.notificationDeleteComment}
            translateEditComment={translations.editComment}
            translateEnterComment={translations.enterComment}
            translateSend={translations.send}
            translateSave={translations.save}
            translateCharactersLeft={translations.charactersLeft}
        />
    );
};

export default Comments;
