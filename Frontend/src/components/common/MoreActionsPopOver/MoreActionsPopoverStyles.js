// @flow

import { ICON_COLOR, HEADER_CELL, HOVER_BACKGROUND_COLOR } from 'crm-constants/jss/colors';
import { FONT_SIZE_NORMAL } from 'crm-constants/jss/fonts';

export default ({ spacing }: Object) => ({
    customPopover: {
        marginTop: spacing(4),
        marginLeft: -spacing(6),
    },
    buttons: {
        'color': ICON_COLOR,
        'cursor': 'pointer',
        'opacity': 0.5,

        '&:hover': {
            opacity: 1,
        },
    },
    actionButtons: {
        'color': ICON_COLOR,
        'cursor': 'pointer',

        '& svg': {
            opacity: 0.5,
        },

        '&:hover': {
            'background': 'none',
            'color': ICON_COLOR,

            '& svg': {
                opacity: 1,
            },
        },
    },
    actionLabels: {
        '&:hover': {
            color: ICON_COLOR,
        },

        'color': HEADER_CELL,
        'cursor': 'pointer',
        'fontSize': FONT_SIZE_NORMAL,
        'marginLeft': spacing(),
    },
    row: {
        '&:hover': {
            background: HOVER_BACKGROUND_COLOR,
        },
    },
});
