import { includes } from 'ramda';
import { HEAD_SALES } from 'crm-constants/roles';

const applyForUsers = (applyId, userRoles) => applyId || (!!userRoles && includes(HEAD_SALES, userRoles));

export default applyForUsers;
