// @flow

import React from 'react';

import { Paper } from '@material-ui/core';

const Menu = (props: *) => (
    <Paper
        square className={props.selectProps.paperClass || props.selectProps.classes.paper}
        {...props.innerProps}
    >
        {props.children}
    </Paper>
);

export default Menu;
