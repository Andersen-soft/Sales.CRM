// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Radio, type RadioProps } from '@material-ui/core';

import styles from './CRMRadioStyles';

const CRMRadio = ({
    classes,
    ...props
}: RadioProps) => {
    return (
        <Radio
            className={classes.radio}
            {...props}
        />
    );
};


export default withStyles(styles)(CRMRadio);
