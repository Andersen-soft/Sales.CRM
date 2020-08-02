// @flow

import React from 'react';
import cn from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import styles from './NotificationStyles';

import type { Node } from 'react';

type SnackbarProps = {
    classes: Object,
    className?: string,
    message: string | Node,
    onClose?: () => void,
    variant: 'success' | 'warning' | 'error' | 'info' | 'notification',
    isHidenIcon?: boolean,
}

type NotificationProps = {
    classes: Object,
    type: 'success' | 'warning' | 'error' | 'info' | 'notification',
    message: string,
    open: bool,
    anchorOrigin: {
        vertical: string,
        horizontal: string,
    },
    handleClose: () => void,
    isHidenIcon?: boolean,
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
    notification: null,
};

const MySnackbarContent = ({
    classes,
    className,
    message,
    onClose,
    variant,
    isHidenIcon,
    ...rest
}: SnackbarProps) => {
    const getIconComponent = () => {
        if (!isHidenIcon && variantIcon[variant]) {
            const IconComponent = variantIcon[variant];

            return <IconComponent className={cn(classes.icon, classes.iconVariant)} />;
        }

        return null;
    };

    return (
        <SnackbarContent
            className={cn(classes[variant], classes.messageRoot, className)}
            aria-describedby='client-snackbar'
            message={
                <span id='client-snackbar' className={classes.message}>
                    {getIconComponent()}
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key='close'
                    aria-label='Close'
                    color='inherit'
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...rest}
        />
    );
};

const Notification = ({
    classes,
    type,
    message,
    open,
    anchorOrigin: { vertical, horizontal },
    handleClose,
    isHidenIcon = false,
}: NotificationProps) => (
    <div>
        <Snackbar
            anchorOrigin={{
                vertical,
                horizontal,
            }}
            open={open}
        >
            <MySnackbarContent
                onClose={handleClose}
                variant={type}
                message={message}
                style={{ maxWidth: 'none' }}
                isHidenIcon={isHidenIcon}
                className={classes.notificationWrapper}
                classes={classes}
            />
        </Snackbar>
    </div>
);

Notification.defaultProps = {
    type: 'error',
    message: 'Error message',
    open: false,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
    isHidenIcon: false,
};

export default withStyles(styles)(Notification);
