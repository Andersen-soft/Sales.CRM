// @flow

import { HR } from 'crm-roles';

export const checkDisableDeleteButton = (
    userRoles: Array<string>,
    resumeCount: number,
) => {
    const isUserHr = !!userRoles && userRoles.length === 1 && userRoles.includes(HR);
    const isRequestHasResume = !!resumeCount;

    return (isUserHr || isRequestHasResume);
};
