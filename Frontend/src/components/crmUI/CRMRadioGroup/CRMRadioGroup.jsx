// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, RadioGroup } from '@material-ui/core';

import CRMRadioItem from './CRMRadioItem';
import styles from './CRMRadioGroupStyles';

type Props = {
    classes: Object,
    value: string,
    content: Array<{ value: string, label: string, icon?: boolean }>,
    handleRadioChange: () => void,
    labelHeader?: string,
};

const CRMRadioGroup = ({
    classes,
    value,
    content,
    handleRadioChange,
    labelHeader,
}: Props) => (
    <>
        {labelHeader && <Typography className={classes.headerText}>
            {labelHeader}
        </Typography>}
        <RadioGroup
            value={value}
            onChange={handleRadioChange}
        >
            <Grid
                container
                className={classes.container}
            >
                {content.map(({ value: contentValue }, index, arr) =>
                    <CRMRadioItem
                        key={contentValue}
                        content={arr}
                        index={index}
                    />
                )}
            </Grid>
        </RadioGroup>
    </>
);

export default withStyles(styles)(CRMRadioGroup);
