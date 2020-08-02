// @flow

import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import styles from './CRMLinkStyles';

export type LocationShape = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: *,
};

type Props = {
    classes: Object,
    className?: string,
    to?: string | LocationShape,
    replace?: boolean,
    children?: React$Element<*>,
    onClick: (event: SyntheticEvent<EventTarget>) => void,
};

const CRMLink = ({
    children,
    className,
    classes,
    onClick,
    to,
    ...props
}: Props) => {
    const handleClick = (event: SyntheticEvent<EventTarget>) => {
        !to && event.preventDefault();

        onClick && onClick(event);
    };

    return (
        <Link
            className={cn(classes.link, className)}
            to={to || '$'}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
};

export default withStyles(styles)(CRMLink);
