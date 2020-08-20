// @flow
import { combineReducers } from 'redux';
import type { ReducersMapObject } from 'redux';

import type { EstimationRequestState } from 'crm-types/estimationRequests';
import session, { type types } from './session';
import Sales from './desktop/sales';
import ActivitiesHistory from './SalePage/activitiesHistory';
import CompanyCard from './SalePage/companyCardReducers';
import PastActivities from './pastActivities/pastActivities';
import SaleCard from './SalePage/saleCardReducers';
import ContactsList from './SalePage/contactsCardReducers';
import ResumeRequest, { type CombinedState } from './resumeRequest/resumeRequest';
import EstimationRequest from './estimationRequest/estimationRequestReducer';
import AllResumeRequests, { type ResumeRequestState } from './allResumeRequests/resumes';
import AllEstimationRequests from './allEstimationRequests/allEstimationRequestsReducer';
import AdminUsers from './adminUsers';
import AdminActivities from './AdminActivities/AdminActivities';

export type AppState = {
    AllResumeRequests: ResumeRequestState,
    AllEstimationRequests: EstimationRequestState,
    ResumeRequest: CombinedState,
    session: types.SessionStore,
};

const reducers: ReducersMapObject<AppState> = {
    session,
    Sales,
    ActivitiesHistory,
    CompanyCard,
    PastActivities,
    SaleCard,
    ContactsList,
    ResumeRequest,
    EstimationRequest,
    AllResumeRequests,
    AllEstimationRequests,
    AdminUsers,
    AdminActivities,
};

export default combineReducers(reducers);
