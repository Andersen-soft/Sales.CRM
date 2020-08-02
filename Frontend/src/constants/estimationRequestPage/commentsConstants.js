// @flow

export const URL_COMMENTS = (id: number) => `/estimation_requests/${id}/comments`;
export const URL_CHANGE_COMMENTS = (
    estimationId: number,
    commentId: number,
) => `/estimation_requests/${estimationId}/comments/${commentId}`;

export const COMMENTS_REQUEST_SIZE = 1000;
export const MAX_INPUT_LENGTH = 600;

export const NOTIFICATION_ERRORS = {
    ADD_COMMENT_ERR: 'При добавлении комментария произошла ошибка',
    DELETE_COMMENT_ERR: 'При удалении комментария произошла ошибка',
    UPDATE_COMMENT_ERR: 'При редактировании комментария произошла ошибка',
};

export const ADD_OR_UPDATE_COMMENT_MESSAGE = '/topic/estimation_request/comments';
export const DELETE_COMMENT_MESSAGE = '/topic/estimation_request/deleted';
