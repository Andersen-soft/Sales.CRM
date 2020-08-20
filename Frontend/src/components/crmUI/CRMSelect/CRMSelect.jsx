// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Select, type SelectProps } from '@material-ui/core';

import styles from './CRMSelectStyles';

const CRMSelect = ({
    classes,
    ...props
}: SelectProps) => {
    return (
        <Select
            className={classes.select}
            {...props}
        />
    );
};


export default withStyles(styles)(CRMSelect);
