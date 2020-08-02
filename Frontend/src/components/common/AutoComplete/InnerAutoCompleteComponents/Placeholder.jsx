// @flow

import React from 'react';
import { Typography } from '@material-ui/core';

const Placeholder = ({ selectProps, innerProps, children }: *) => (
    <Typography
        color={selectProps.error ? 'error' : 'textSecondary'}
        className={selectProps.classes.placeholder}
        {...innerProps}
    >
        {children}
    </Typography>
);

export default Placeholder;
