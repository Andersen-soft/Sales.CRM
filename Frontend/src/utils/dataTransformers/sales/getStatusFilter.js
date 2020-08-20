// @flow

import { ALL_STATUSES } from 'crm-constants/desktop/statuses';

export default function getStatusFilter(statusFilter?: Array<string>) {
    return statusFilter && statusFilter.includes(ALL_STATUSES) ? null : statusFilter;
}
