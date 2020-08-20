// @flow

import React, { memo } from 'react';
import { connect } from 'react-redux';
import AllEstimationRequest from 'crm-components/allEstimationRequest/AllEstimationRequest';

import type { AppState } from 'crm-stores';

type MemoProps = {
    session: {
        userData: { roles: Array<string> },
    },
}

const mapStateToProps = ({
    session: { userData: { roles } },
}: AppState) => ({
    roles,
});

export default memo < MemoProps > (connect(mapStateToProps, null)(AllEstimationRequest));
