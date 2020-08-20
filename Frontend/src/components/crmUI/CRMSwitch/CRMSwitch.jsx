// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

import styles from './CRMSwitchStyles';

type Props = {
    classes: Object,
}

const CRMSwitch = ({
    classes,
    ...props
}: Props) => <Switch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
    }}
    {...props}
/>;

export default withStyles(styles)(CRMSwitch);
