// @flow
import { statusColors } from 'crm-constants/jss/colors';

const STATUSES_TRANSLATE_KEYS: Object = {
    allStatuses: 'lists.statuses.allStatuses',
    preLead: 'lists.statuses.preLead',
    lead: 'lists.statuses.lead',
    inWork: 'lists.statuses.inWork',
    opportunity: 'lists.statuses.opportunity',
    contract: 'lists.statuses.contract',
    overdueActivities: 'lists.statuses.overdueActivities',
    archive: 'lists.statuses.archive',
};

export type StatusKeyType =
    | 'ALL_STATUSES'
    | 'PRELEAD'
    | 'LEAD'
    | 'INWORK'
    | 'OPPORTUNITY'
    | 'CONTRACT'
    | 'OVERDUE_ACTIVITIES'
    | 'ARCHIVE';

export type SalesStatusKeyType =
    | 'PRELEAD'
    | 'OPPORTUNITY'
    | 'LEAD'
    | 'CONTRACT'
    | 'INWORK'
    | 'ARCHIVE';

export const ALL_STATUSES: string = 'ALL_STATUSES';
export const PRELEAD: string = 'PRELEAD';
export const LEAD: string = 'LEAD';
export const INWORK: string = 'INWORK';
export const OPPORTUNITY: string = 'OPPORTUNITY';
export const CONTRACT: string = 'CONTRACT';
export const OVERDUE_ACTIVITIES: string = 'OVERDUE_ACTIVITIES';
export const ARCHIVE: string = 'ARCHIVE';

export const STATUSES_ENUM_CODE_ORDER = [PRELEAD, LEAD, INWORK, OPPORTUNITY, CONTRACT, ARCHIVE];

export const STATUSES: Array<{ statusKey: string, styleClass: string, translateKey: string }> = [
    { statusKey: ALL_STATUSES, styleClass: 'all', translateKey: STATUSES_TRANSLATE_KEYS.allStatuses },
    { statusKey: PRELEAD, styleClass: 'preLead', translateKey: STATUSES_TRANSLATE_KEYS.preLead },
    { statusKey: LEAD, styleClass: 'lead', translateKey: STATUSES_TRANSLATE_KEYS.lead },
    { statusKey: INWORK, styleClass: 'inWork', translateKey: STATUSES_TRANSLATE_KEYS.inWork },
    { statusKey: OPPORTUNITY, styleClass: 'opportunity', translateKey: STATUSES_TRANSLATE_KEYS.opportunity },
    { statusKey: CONTRACT, styleClass: 'contract', translateKey: STATUSES_TRANSLATE_KEYS.contract },
    { statusKey: OVERDUE_ACTIVITIES, styleClass: 'overdue', translateKey: STATUSES_TRANSLATE_KEYS.overdueActivities },
    { statusKey: ARCHIVE, styleClass: 'archive', translateKey: STATUSES_TRANSLATE_KEYS.archive },
];

export type SalesStatusType = {
    statusKey: string,
    color: string,
    translateKey: string,
};

export const saleStatuses: Array<SalesStatusType> = [
    { statusKey: PRELEAD, color: statusColors.PRELEAD, translateKey: STATUSES_TRANSLATE_KEYS.preLead },
    { statusKey: OPPORTUNITY, color: statusColors.OPPORTUNITY, translateKey: STATUSES_TRANSLATE_KEYS.opportunity },
    { statusKey: LEAD, color: statusColors.LEAD, translateKey: STATUSES_TRANSLATE_KEYS.lead },
    { statusKey: CONTRACT, color: statusColors.CONTRACT, translateKey: STATUSES_TRANSLATE_KEYS.contract },
    { statusKey: INWORK, color: statusColors.IN_WORK, translateKey: STATUSES_TRANSLATE_KEYS.inWork },
    { statusKey: ARCHIVE, color: statusColors.ARCHIVE, translateKey: STATUSES_TRANSLATE_KEYS.archive },
];

export const ONLY_WORKING_STATUSES: Array<{
    statusKey: string,
    styleClass: string,
}> = [...STATUSES.slice(1, 6), STATUSES[7]];

export const HR_NEED = 'hr need';
export const IN_PROGRESS = 'In progress';
export const DONE = 'done';
