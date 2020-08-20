// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import CRMIcon from 'crm-icons';
import { ExpandLess } from '@material-ui/icons';

import styles from './CRMScrollTopButtonStyles';

type Props = {
    classes: Object,
    position: string,
    onClick: () => void,
}

const CRMScrollTopButton = ({ classes, onClick }: Props) => (
    <Fab
        size='small'
        color='primary'
        onClick={onClick}
        className={classes.scrollTopButton}
    >
        <CRMIcon
            className={classes.topIcon}
            IconComponent={ExpandLess}
        />
    </Fab>
);

export default withStyles(styles)(CRMScrollTopButton);
