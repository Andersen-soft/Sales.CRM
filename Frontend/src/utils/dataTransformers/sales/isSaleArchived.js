// @flow

import type { Sale } from 'crm-types/resourceDataTypes';
import { ARCHIVE } from 'crm-constants/desktop/statuses';

export function isArchiveStatus(status: string) {
    return status === ARCHIVE;
}

export default function isSaleArchived(sale: Sale) {
    return isArchiveStatus(sale.status);
}
