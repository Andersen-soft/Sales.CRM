// @flow

import { GREY, UNDERLINE } from 'crm-constants/jss/colors';

const CRMDateInputStyles = ({ spacing }: Object) => ({
    input: {
        width: spacing(29),
    },
    inputHint: {
        color: `${GREY} !important`,
    },
    popupRoot: {
        boxShadow: `0 2px ${spacing(1.5)}px rgba(0, 0, 0, 0.3)`,
    },
    inlineStyle: {
        display: 'inline-block',
        borderBottom: `0.1em dashed ${UNDERLINE}`,
        '&:hover': {
            cursor: 'pointer',
            opacity: 0.5,
        },
    },
    popper: {
        zIndex: 2000,
        minWidth: spacing(26.5),
    },
});

export default CRMDateInputStyles;

