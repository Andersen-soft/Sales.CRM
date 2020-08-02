// @flow

import { RED, GREEN, ORANGE, GREY_DARK, WHITE } from 'crm-constants/jss/colors';

const NotificationStoriesStyles = () => ({
    success: {
        'backgroundColor': GREEN,
        'color': WHITE,
        '&:hover': {
            backgroundColor: GREEN,
        },
    },
    warning: {
        'backgroundColor': ORANGE,
        'color': WHITE,
        '&:hover': {
            backgroundColor: ORANGE,
        },
    },
    error: {
        'backgroundColor': RED,
        'color': WHITE,
        '&:hover': {
            backgroundColor: RED,
        },
    },
    info: {
        'backgroundColor': GREY_DARK,
        'color': WHITE,
        '&:hover': {
            backgroundColor: GREY_DARK,
        },
    },
    input: {
        width: '100%',
    },
});

export default NotificationStoriesStyles;
