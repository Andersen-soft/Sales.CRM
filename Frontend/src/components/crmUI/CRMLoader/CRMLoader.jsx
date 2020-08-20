// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import cn from 'classnames';

import styles from './CRMLoaderStyles';

type Props = {
    classes: Object,
    position: string,
}

const CRMLoader = ({ classes, position }: Props) => (
    <CircularProgress className={cn(classes.loader, { [classes.fixedLoader]: position === 'fixed' })} />
);

export default withStyles(styles)(CRMLoader);
