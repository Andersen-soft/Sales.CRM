// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles/index';
import type { StyledComponentProps } from '@material-ui/core/es';
import { Drawer, Grid } from '@material-ui/core';

import styles from './CRMDrawerStyles';

type Props = {
    children: Node,
    onToogleDrawer: () => void,
    open: boolean,
} & StyledComponentProps;

const CRMDrawer = ({
    classes,
    children,
    onToogleDrawer,
    open,
    ...props
}: Props) => (
    <Drawer
        anchor='top'
        onClose={onToogleDrawer}
        open={open}
        classes={{ paper: classes.MobileFilterDrawerPaper }}
        {...props}
    >
        <Grid>
            {children}
        </Grid>
    </Drawer>
);

export default withStyles(styles)(CRMDrawer);
