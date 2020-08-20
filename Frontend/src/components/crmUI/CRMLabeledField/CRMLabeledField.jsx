// @flow

import * as React from 'react';
import cn from 'classnames';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import type { StyledComponentProps } from '@material-ui/core/es';

import { GridProps } from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import styles from './CRMLabeledFieldStyles';

export type CRMLabeledFieldProps = {
    name: string,
    labelContainerClassName?: string,
    valueClassName?: string,
} & GridProps &
    StyledComponentProps;

const LabeledField = ({
    name,
    children,
    classes,
    className,
    labelContainerClassName,
    valueClassName,
    ...props
}: CRMLabeledFieldProps) => (
    <Grid
        item
        container
        xs={12}
        justify='space-between'
        wrap='nowrap'
        className={cn(className, classes.root)}
        {...props}
    >
        <Grid
            item
            className={labelContainerClassName}
            xs={5}
            container
            alignContent='center'
        >
            <Typography className={classes.label}>
                {name}:
            </Typography>
        </Grid>
        <Grid
            item
            container
            justify='flex-end'
            alignContent='center'
            className={valueClassName}
            xs={7}
        >
            {children}
        </Grid>
    </Grid>
);

export default withStyles(styles)(LabeledField);
