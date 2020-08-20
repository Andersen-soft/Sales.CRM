// @flow

import { ICON_COLOR } from 'crm-constants/jss/colors';

const CRMIconStyles = ({ spacing }: Object) => ({
    icon: {
        'color': ICON_COLOR,
        'opacity': 0.5,
        '&:hover': {
            opacity: 1,
        },
    },
    noOpacity: {
        opacity: 1,
    },
    fixedSize: {
        height: spacing(3),
        width: spacing(3),
    },
    pointer: {
        cursor: 'pointer',
    },
});

export default CRMIconStyles;
