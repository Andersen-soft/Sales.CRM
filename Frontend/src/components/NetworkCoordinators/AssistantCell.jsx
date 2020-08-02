// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';

import styles from './NetworkCoordinatorsStyles';

type Props = {
    values: [string, number, () => void];
    classes: Object,
};

const AssistantCell = ({
    values: [fio, userId, reloadTable],
    classes,
}: Props) => <UserInformationPopover
    userId={userId}
    userName={fio}
    userNameStyle={classes.underlineName}
    reloadParent={reloadTable}
/>;

export default withStyles(styles)(AssistantCell);
