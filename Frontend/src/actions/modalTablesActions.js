// @flow

import { GET_ACTIVITY_TABLE } from 'crm-constants/activityTable';
import { ADD_RESUME_TO_FAVORITES, GET_RESUME_REQUEST_TABLE } from 'crm-constants/resumeRequestTable';
import { ADD_MARK_TO_FAVORITES, GET_MARK_REQUEST_TABLE } from 'crm-constants/markRequestTable';
import type { ActivityTableContent, MarkRequestTableContent, ResumeRequestTableContent } from '../stores/Store.flow';

export const getActivityTable: Function = (data: Array<ActivityTableContent>) =>
    (
        {
            type: GET_ACTIVITY_TABLE,
            payload: data,
        }
    );

export const getResumeRequestTable: Function = (data: Array<ResumeRequestTableContent>) =>
    (
        {
            type: GET_RESUME_REQUEST_TABLE,
            payload: data,
        }
    );

export const addResumeToFavorites: Function = (index: number) =>
    (
        {
            type: ADD_RESUME_TO_FAVORITES,
            payload: index,
        }
    );


export const getMarkRequestTable: Function = (data: Array<MarkRequestTableContent>) =>
    (
        {
            type: GET_MARK_REQUEST_TABLE,
            payload: data,
        }
    );

export const addMarkToFavorites: Function = (index: number) =>
    (
        {
            type: ADD_MARK_TO_FAVORITES,
            payload: index,
        }
    );
