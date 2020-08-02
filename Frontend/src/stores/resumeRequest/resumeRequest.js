// @flow

import { combineReducers } from 'redux';
import type { ReducersMapObject } from 'redux';

import Resume, { type ResumeState } from './resumeReducer';
import ResumeRequestCard, { type RequestState } from './resumeRequestCardReducer';

export type CombinedState = {
    Resume: ResumeState,
    ResumeRequestCard: RequestState,
}

const reducers: ReducersMapObject<CombinedState> = {
    Resume, ResumeRequestCard,
};

export default combineReducers(reducers);
