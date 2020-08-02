// @flow

import { combineReducers } from 'redux';
import type { ReducersMapObject } from 'redux';

import History, { type HistoryState } from './historyReducer';
import EstimationTable, { type EstimationTableState } from './estimationRequestTableReducer';

export type EstimationRequestState = {
    History: HistoryState,
    EstimationTable: EstimationTableState,
}

const reducers: ReducersMapObject<EstimationRequestState> = {
    History,
    EstimationTable,
};

export default combineReducers(reducers);

