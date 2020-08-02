// @flow

import React from 'react';

import { MenuItem } from '@material-ui/core';

const Option = (props: *) => (
    <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        disabled={props.isDisabled}
        component='div'
        style={{
            fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
    >
        {props.children}
    </MenuItem>
);

export default Option;
