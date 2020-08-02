// @flow

import React, { type Node } from 'react';
import cn from 'classnames';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles, { useStatusStyle } from './CRMStatusStyle';

export type StatusButtonProps = $Rest<$Shape<HTMLButtonElement>, {|children: *|}> & {
    color: string,
    selected?: boolean,
    children?: Node,
} & StyledComponentProps;

const StatusButton = ({
    color, children, className, selected, classes, ...btnProps
}: StatusButtonProps) => {
    const btnClasses = useStatusStyle({ color, selected });

    return (<Button
        classes={{
            root: cn(btnClasses.statusButton, className, classes.button),
        }}
        {...btnProps}
    >
        {children}
    </Button>);
};

export default withStyles(styles)(StatusButton);
