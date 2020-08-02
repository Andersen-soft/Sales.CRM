// @flow

import type { ComponentType } from 'react';

import { pages } from 'crm-constants/navigation';
import AdminUsersPage from 'crm-containers/AdminUsersPage';
import AdminActivitiesPage from 'crm-containers/AdminActivitiesPage';
import LoginPage from 'crm-containers/LoginPage/LoginPage';
import ExpressSaleForm from 'crm-components/ExpressSaleForm/ExpressSaleForm';
import SalePage from 'crm-containers/SalePage';
import DefaultPage from 'crm-containers/DefaultPage';
import Desktop from 'crm-containers/Desktop';
import ReportByLeadPage from 'crm-components/ReportByLeadPage/ReportByLeadPage';
import reportByActivitiesPage from 'crm-components/ReportByActivitiesPage';
import reportBySocialContactsPage from 'crm-containers/ReportBySocialContactsPage';
import SocialNetworkContactsPage from 'crm-components/SocialNetworkContactsPage';
import ResumeRequestPage from 'crm-containers/ResumeRequestPage/ResumeRequestPage';
import EstimationRequestPage from 'crm-containers/EstimationRequestPage';
import SocialAnswerForm from 'crm-containers/SocialAnswerForm';
import SearchPage from 'crm-components/searchPage';
import ReportBySocialContactsSalesHead from 'crm-components/ReportBySocialContactsSalesHead/ReportBySocialContactsSalesHead';
import AllResumeRequestPage from 'crm-containers/AllResumeRequestPage';
import AllEstimationRequestPage from 'crm-containers/AllEstimationRequestPage';
import ResumePage from 'crm-components/Resume';
import NetworkCoordinators from 'crm-components/NetworkCoordinators/NetworkCoordinators';
import NetworkCoordinatorsSalesHead from 'crm-components/NetworkCoordinatorsSalesHead/NetworkCoordinatorsSalesHead';

import {
    ADMIN, HEAD_SALES, HR, SALES, MANAGER, RM, NETWORK_COORDINATOR,
} from 'crm-constants/roles';

export type RouteConf = {
    path: string,
    exact?: boolean,
    component: ComponentType<Object>,
    allowedRoles?: Array<string>,
    isPublic?: boolean,
    title: string,
};

const routesConfig: Array<RouteConf> = [
    {
        path: pages.LOGIN,
        component: LoginPage,
        isPublic: true,
        title: '',
    },
    {
        path: pages.EXPRESS_SALE_FORM,
        component: ExpressSaleForm,
        isPublic: true,
        title: 'Express sale form',
    },
    {
        path: pages.GLOBAL_SEARCH,
        component: SearchPage,
        allowedRoles: [MANAGER, HEAD_SALES, RM, SALES],
        title: 'General search',
    },
    {
        path: pages.SOCIAL_ANSWER_FORM,
        component: SocialAnswerForm,
        allowedRoles: [NETWORK_COORDINATOR],
        title: 'Social network reply',
    },
    {
        path: pages.NETWORK_COORDINATORS,
        component: NetworkCoordinators,
        allowedRoles: [NETWORK_COORDINATOR],
        title: 'Network Coordinators',
    },
    {
        path: pages.SALES_HEAD_NETWORK_COORDINATORS,
        component: NetworkCoordinatorsSalesHead,
        allowedRoles: [HEAD_SALES],
        title: 'Network Coordinators',
    },
    {
        path: `${pages.RESUME_REQUESTS}/:resumeId`,
        component: ResumeRequestPage,
        allowedRoles: [HEAD_SALES, HR, SALES, MANAGER, RM],
        title: 'Request for CV',
    },
    {
        path: `${pages.ESTIMATION_REQUESTS}/:estimationId`,
        component: EstimationRequestPage,
        allowedRoles: [HEAD_SALES, SALES, MANAGER, RM],
        title: 'Request for estimation',
    },
    {
        path: pages.DESKTOP,
        exact: true,
        component: Desktop,
        allowedRoles: [SALES],
        title: 'Desktop',
    },
    {
        path: pages.RESUME_REQUESTS_ALL,
        exact: true,
        component: AllResumeRequestPage,
        allowedRoles: [MANAGER, HEAD_SALES, HR, RM, SALES],
        title: 'Requests for CV',
    },
    {
        path: pages.RESUME,
        exact: true,
        component: ResumePage,
        allowedRoles: [HR],
        title: 'Resume',
    },
    {
        path: pages.ESTIMATION_REQUEST_ALL,
        exact: true,
        component: AllEstimationRequestPage,
        allowedRoles: [MANAGER, HEAD_SALES, RM, SALES],
        title: 'Requests for estimation',
    },
    {
        path: pages.REPORTS_LEAD,
        component: ReportByLeadPage,
        allowedRoles: [HEAD_SALES, SALES],
        title: 'Lead report',
    },
    {
        path: pages.REPORTS_ACTIVE,
        component: reportByActivitiesPage,
        allowedRoles: [HEAD_SALES],
        title: 'Activity Report',
    },
    {
        path: pages.REPORTS_SOCIAL,
        component: reportBySocialContactsPage,
        allowedRoles: [SALES],
        title: 'Social network replies',
    },
    {
        path: pages.SALES_HEAD_REPORTS_SOCIAL,
        component: ReportBySocialContactsSalesHead,
        allowedRoles: [HEAD_SALES],
        title: 'All social network replies',
    },
    {
        path: `${pages.SALES_FUNNEL}/:saleId`,
        component: SalePage,
        allowedRoles: [SALES, HEAD_SALES, HR, MANAGER, RM],
        title: 'Sale',
    },
    {
        path: pages.SOCIAL_NETWORK_CONTACTS,
        component: SocialNetworkContactsPage,
        allowedRoles: [HEAD_SALES],
        title: 'Virtual profiles',
    },
    {
        path: `${pages.ADMIN_USERS}/:usersId`,
        component: AdminActivitiesPage,
        allowedRoles: [ADMIN],
        title: 'Sales activities',
    },
    {
        path: pages.ADMIN_USERS,
        component: AdminUsersPage,
        allowedRoles: [ADMIN],
        title: 'CRM Users',
    },
    {
        path: '/',
        component: DefaultPage,
        allowedRoles: [MANAGER, HEAD_SALES, HR, RM, SALES, ADMIN, NETWORK_COORDINATOR],
        title: '',
    },
];

export default routesConfig;
