// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDefaultPage } from 'crm-helpers/navigation';

type Props = {
    userRole: Array<string>,
}

const DefaultPage = ({ userRole }: Props) => (
    <Redirect to={getDefaultPage(userRole)} />
);

export default connect(({ session }) => ({
    userRole: session.userData.roles,
}))(DefaultPage);
