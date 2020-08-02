// @flow

import type { CRMError } from 'crm-utils/errors';

export type UserSessionData = {
    username?: string,
    roles?: Array<string>,
    id?: number,
};

export type SessionStore = {
    userData: UserSessionData | null,
    loading: boolean,
    err: CRMError | null,
    prevPath: string | null,
};
