import { includes } from 'ramda';
import { HR } from 'crm-constants/roles';

const disableForHr = userRoles => !!userRoles && includes(HR, userRoles);

export default disableForHr;
