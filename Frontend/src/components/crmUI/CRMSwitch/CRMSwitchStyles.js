// @flow

import { UNDERLINE, PRIMARY_COLOR, WHITE } from 'crm-constants/jss/colors';

const CRMSwitchStyles = ({
    spacing,
    typography: {
        caption: { fontSize },
    },
    transitions,
}: Object) => ({
    root: {
        width: spacing(4.5),
        height: spacing(2.5),
        padding: 0,
        margin: spacing(1),
    },
    switchBase: {
        'padding': 2,
        '&$checked': {
            'transform': 'translateX(16px)',
            'color': WHITE,
            '& + $track': {
                backgroundColor: PRIMARY_COLOR,
                opacity: 1,
            },
            '&:hover': {
                backgroundColor: 'unset',
            },
        },
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    thumb: {
        width: spacing(2),
        height: spacing(2),
        boxShadow: 'unset',
    },
    track: {
        borderRadius: 10,
        backgroundColor: UNDERLINE,
        opacity: 1,
        transition: transitions.create(['background-color']),
    },
    checked: {},
    focusVisible: {},
});

export default CRMSwitchStyles;
