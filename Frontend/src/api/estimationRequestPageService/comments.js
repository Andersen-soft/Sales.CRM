// @flow

import {
    URL_COMMENTS,
    URL_CHANGE_COMMENTS,
    COMMENTS_REQUEST_SIZE,
} from 'crm-constants/estimationRequestPage/commentsConstants';
import crmRequest from 'crm-helpers/api/crmRequest';

export const fetchComments = (estimationId: number) => crmRequest({
    url: URL_COMMENTS(estimationId),
    method: 'GET',
    params: {
        id: estimationId,
        page: 0,
        size: COMMENTS_REQUEST_SIZE,
        sort: 'createDate,asc',
    },
});

export const deleteComment = (estimationId: number, commentId: number) => crmRequest({
    url: URL_CHANGE_COMMENTS(estimationId, commentId),
    method: 'DELETE',
});

export const editComment = (estimationId: number, commentId: number, description: string) => crmRequest({
    url: URL_CHANGE_COMMENTS(estimationId, commentId),
    method: 'PUT',
    data: { description },
});

export const addComment = (estimationId: number, description: string) => crmRequest({
    url: URL_COMMENTS(estimationId),
    data: { description },
});
