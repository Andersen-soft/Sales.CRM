// @flow

import React, { memo } from 'react';
import { connect } from 'react-redux';
import AllResumeRequest from 'crm-components/allResumesRequest/AllResumeRequestPage';

import type { AppState } from 'crm-stores';

type MemoProps = {
    session: {
        userData: { roles: Array<string> },
    },
}

const mapStateToProps = ({
    session: {
        userData: { roles },
    },
}: AppState) => ({
    roles,
});

export default memo < MemoProps > (connect(mapStateToProps, null)(AllResumeRequest));
