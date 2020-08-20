// @flow

import React from 'react';

import { Grid } from '@material-ui/core';

const NoOptionsMessage = (props: *) => (
    <Grid
        color='textSecondary'
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
    >
        {props.children || 'Нет данных по запросу'}
    </Grid>
);

export default NoOptionsMessage;
