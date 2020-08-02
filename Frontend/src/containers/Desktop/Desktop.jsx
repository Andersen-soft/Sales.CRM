// @flow

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import {
    fetchSales,
    fetchSalesCount,
    editSale,
} from 'crm-actions/desktopActions/salesActions';
import { addActivity } from 'crm-actions/desktopActions/activityActions';
import Desktop from 'crm-components/desktop';
import type { SalesState } from 'crm-stores/desktop/sales';
import type { SessionStore } from 'crm-stores/session/SessionStore.flow';

type MemoProps = {
    sales: {
        content: Array<*>,
        totalElements: number,
    },
    salesCount: { [string]: number },
    isLoading: boolean,
    userId: string,
};

const mapStateToProps = (state: { Sales: SalesState, session: SessionStore }) => ({
    sales: state.Sales.sales,
    salesCount: state.Sales.salesCount,
    isLoading: state.Sales.isLoading,
    userId: pathOr(null, ['session', 'userData', 'id'], state),
});

const mapDispatchToProps = {
    fetchSales,
    fetchSalesCount,
    addActivity,
    editSale,
};

export default memo < MemoProps > (connect(mapStateToProps, mapDispatchToProps)(Desktop));
