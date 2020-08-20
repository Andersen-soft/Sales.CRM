// @flow

import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button, { type ButtonProps } from '@material-ui/core/Button';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import styles from './CRMButtonStyles';

const CRMButton = ({
    classes,
    children,
    size,
    variant,
    fullWidth,
    className,
    primary,
    grey,
    ...rest
}: ButtonProps) => {
    const isMobile = useMobile();

    return <Button
        {...rest}
        className={classNames(
            className,
            classes.button,
            {
                [classes.largeButton]: size === 'large',
                [classes.action]: variant === 'action',
                [classes.fullWidth]: fullWidth,
                [classes.primary]: primary,
                [classes.grey]: grey,
                [classes.mobile]: isMobile,
            })}
        classes={{ disabled: classes.disabled }}
        TouchRippleProps={{
            classes: { root: classes.touchRipple },
        }}
    >
        {children}
    </Button>;
};

export default withStyles(styles)(CRMButton);
