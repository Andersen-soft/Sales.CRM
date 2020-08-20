// @flow

import { HEAD_SALES, SALES } from 'crm-constants/roles';
import {
    ACTIVITIES,
    SOCIAL_NETWORK_CONTACTS,
    REPORTS,
    RESUME_REQUESTS_ALL,
    RESUME,
    ESTIMATION_REQUEST_ALL,
    DESKTOP,
    REPORTS_LEAD,
    REPORTS_ACTIVE,
    REPORTS_SOCIAL,
    SALES_HEAD_REPORTS_SOCIAL,
    ADMIN_USERS,
    NETWORK_COORDINATORS,
    SALES_HEAD_NETWORK_COORDINATORS,
    SOCIAL_ANSWER_FORM,
} from './pages';

type Child = {
    title: string,
    link: string,
    roles: Array<string>,
}

export type TabSettings = {
    title?: string,
    children?: Array<Child>,
};

export default {
    [DESKTOP]: { title: 'header.desktop' },
    [RESUME_REQUESTS_ALL]: { title: 'header.requestsForCv' },
    [RESUME]: { title: 'header.cv' },
    [ESTIMATION_REQUEST_ALL]: { title: 'header.requestsForEstimation' },
    [REPORTS]: {
        title: 'header.reports.title',
        children: [
            { title: 'header.reports.reportLead', link: REPORTS_LEAD, roles: [SALES, HEAD_SALES] },
            { title: 'header.reports.reportActivity', link: REPORTS_ACTIVE, roles: [HEAD_SALES] },
            { title: 'header.reports.reportMySocial', link: REPORTS_SOCIAL, roles: [SALES] },
            { title: 'header.reports.reportAllSocial', link: SALES_HEAD_REPORTS_SOCIAL, roles: [HEAD_SALES] },
            { title: 'header.reports.networkCoordinators', link: SALES_HEAD_NETWORK_COORDINATORS, roles: [HEAD_SALES] },
        ],
    },
    [ACTIVITIES]: { title: 'header.activity' },
    [ADMIN_USERS]: { title: 'header.users' },
    [SOCIAL_NETWORK_CONTACTS]: { title: 'header.virtualProfiles' },
    [NETWORK_COORDINATORS]: { title: 'header.reports.networkCoordinators' },
    [SOCIAL_ANSWER_FORM]: { title: 'header.socialAnswerForm' },
};
