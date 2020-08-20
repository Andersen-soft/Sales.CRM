// @flow

export type ActivityType = Array<{ name: string, checked: boolean, activityTypeEnumCode: string }>;

export const EMAIL_ACTIVITY: string = 'EMAIL';
export const INTERVIEW_ACTIVITY: string = 'INTERVIEW';
export const PHONE_ACTIVITY: string = 'CALL';
export const SOCIAL_ACTIVITY: string = 'SOCIAL_NETWORK';
export const MEETING_ACTIVITY: string = 'MEETING';

export const NOTIFICATION_ERROR = 'Пожалуйста, создайте Контактное лицо, чтобы добавить Активность';
