// @flow

import type { Employee } from '../constants/estimationRequestPage/estimationRequestPageConstants';

export type tableHeaderType = {
    title: string,
    filtration?: string | null,
    key: string,
    sorting?: 'asc' | 'desc' | null
}

export type ISaleProps = {
    sales: Array<Employee>,
    isSalesLoading: boolean,
    fetchSales?: () => void,
    errors: Object,
}
