// @flow

import { RED, GREEN, ORANGE, GREY_DARK } from 'crm-constants/jss/colors';

const NotificationStyles = ({ spacing }: Object) => ({
    icon: {
        fontSize: spacing(2.5),
    },
    iconVariant: {
        marginRight: spacing(1),
        opacity: '.9',
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    messageRoot: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    notificationWrapper: {
        maxWidth: 'none',
    },
    success: {
        backgroundColor: GREEN,
    },
    error: {
        backgroundColor: RED,
    },
    warning: {
        backgroundColor: ORANGE,
    },
    notification: {
        backgroundColor: GREY_DARK,
        opacity: '.9 !important',
    },
});

export default NotificationStyles;
