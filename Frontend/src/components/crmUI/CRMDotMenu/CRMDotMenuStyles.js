// @flow

import { HEADER_CELL, GREY_LIGHT } from 'crm-constants/jss/colors';

const CRMDotMenuStyles = ({ spacing, zIndex: { snackbar } }: Object) => ({
    root: {
        zIndex: `${snackbar} !important`,
    },
    paper: {
        paddingTop: spacing(),
        paddingBottom: spacing(),
    },
    menuItem: {
        'padding': spacing(2),
        'cursor': 'pointer',
        '&:hover': {
            backgroundColor: GREY_LIGHT,
        },
    },
    icon: {
        marginRight: spacing(),
        '&:hover': {
            opacity: 0.5,
        },
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.4,
    },
    typography: {
        color: HEADER_CELL,
    },
});

export default CRMDotMenuStyles;
