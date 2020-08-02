import {
    ADMIN,
    HEAD_SALES,
    HR,
    SALES,
    MANAGER,
    RM,
    NETWORK_COORDINATOR,
} from 'crm-constants/roles';
import {
    SOCIAL_NETWORK_CONTACTS,
    REPORTS,
    RESUME_REQUESTS_ALL,
    ESTIMATION_REQUEST_ALL,
    DESKTOP,
    RESUME_REQUESTS,
    RESUME,
    ESTIMATION_REQUESTS,
    SOCIAL_ANSWER_FORM,
    GLOBAL_SEARCH,
    ADMIN_USERS,
    NETWORK_COORDINATORS,
} from './pages';

// Если ссылки не должно быть в меню выставляем menuPosition: 100

export default {
    [ADMIN]: [
        { link: ADMIN_USERS, menuPosition: 1 },
        { link: GLOBAL_SEARCH, menuPosition: 100 },
    ],
    [HEAD_SALES]: [
        { link: RESUME_REQUESTS_ALL, menuPosition: 1 },
        { link: ESTIMATION_REQUEST_ALL, menuPosition: 2 },
        { link: REPORTS, menuPosition: 3 },
        { link: SOCIAL_NETWORK_CONTACTS, menuPosition: 4 },
        { link: GLOBAL_SEARCH, menuPosition: 100 },
        { link: RESUME_REQUESTS, menuPosition: 100 },
        { link: ESTIMATION_REQUESTS, menuPosition: 100 },
    ],
    [SALES]: [
        { link: DESKTOP, menuPosition: 0 },
        { link: RESUME_REQUESTS_ALL, menuPosition: 1 },
        { link: ESTIMATION_REQUEST_ALL, menuPosition: 2 },
        { link: REPORTS, menuPosition: 3 },
        { link: GLOBAL_SEARCH, menuPosition: 100 },
        { link: RESUME_REQUESTS, menuPosition: 100 },
        { link: ESTIMATION_REQUESTS, menuPosition: 100 },
    ],
    [HR]: [
        { link: RESUME_REQUESTS_ALL, menuPosition: 1 },
        { link: RESUME, menuPosition: 2 },
        { link: ESTIMATION_REQUESTS, menuPosition: 100 },
    ],
    [MANAGER]: [
        { link: RESUME_REQUESTS_ALL, menuPosition: 1 },
        { link: ESTIMATION_REQUEST_ALL, menuPosition: 2 },
        { link: RESUME_REQUESTS, menuPosition: 100 },
        { link: ESTIMATION_REQUESTS, menuPosition: 100 },
    ],
    [RM]: [
        { link: RESUME_REQUESTS_ALL, menuPosition: 1 },
        { link: ESTIMATION_REQUEST_ALL, menuPosition: 2 },
        { link: RESUME_REQUESTS, menuPosition: 100 },
        { link: ESTIMATION_REQUESTS, menuPosition: 100 },
    ],
    [NETWORK_COORDINATOR]: [
        { link: SOCIAL_ANSWER_FORM, menuPosition: 1 },
        { link: NETWORK_COORDINATORS, menuPosition: 2 },
    ],
};
