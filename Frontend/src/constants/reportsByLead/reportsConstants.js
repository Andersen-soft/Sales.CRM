// @flow

export const PAGE_SIZE: number = 30;
export const MAX_VISIBLE_IDS: number = 5;
export const LEAD_REPORT: string = 'LEAD_REPORT';

export const ESTIMATION: string = 'Оценка';
export const ESTIMATION_EN: string = 'Estimation';
export const RESUME: string = 'Резюме';
export const RESUME_EN: string = 'Resume';

export const TABLE_COLUMN_FILTER_KEYS = {
    SOURCE: 'sourceId',
    RECOMMENDATION: 'recommendationName',
    COMPANY: 'companyId',
    STATUS: 'statusId',
    STATUS_CHANGE_DATE: 'statusChangedDate',
    DELIVERY_DIRECTOR: 'deliveryDirectorIds',
    RESPONSIBLE: 'responsibleIds',
    REQUEST_TYPE: 'type',
    SKYPE: 'skype',
    EMAIL: 'email',
    SOCIAL_CONTACT: 'socialContactName',
    PHONE: 'phone',
    PERSONAL_EMAIL: 'personalEmail',
    COUNTRY: 'countryId',
    CATEGORY: 'categoryId',
    INDUSTRY: 'industry',
};


// Update version if you have to edit columns
export const CONFIG_VERSION = '1.2.0';
// default config
export const columnsVisibleSettings = {
    createDate: true,
    sourceName: true,
    companyRecommendationName: true,
    companyName: true,
    status: true,
    statusChangedDate: true,
    responsibleRmName: true,
    category: true,
    responsibleName: true,
    requestType: true,
    requestNames: true,
    companyUrl: true,
    mainContact: true,
    contactPosition: true,
    skype: true,
    email: true,
    socialNetwork: true,
    socialContact: true,
    phone: true,
    personalEmail: true,
    country: true,
    industries: true,
};
