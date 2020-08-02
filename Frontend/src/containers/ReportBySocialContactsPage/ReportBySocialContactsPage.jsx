// @flow

import React from 'react';
import { connect } from 'react-redux';
import ReportBySocialContacts from 'crm-components/reportBySocialContactsPage';

const mapStateToProps = state => ({
    userData: state.session.userData,
});

export default connect(mapStateToProps, null)(ReportBySocialContacts);
