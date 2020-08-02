// @flow

import { UNDERLINE } from 'crm-constants/jss/colors';

const CRMEditableFieldStyles = ({ typography: { fontSize }, spacing }: Object) => ({
    inlineStyle: {
        'marginRight': spacing(2),
        'display': 'inline-block',
        'borderBottom': `0.1em dashed ${UNDERLINE}`,
        '&:hover': {
            cursor: 'pointer',
            opacity: 0.5,
        },
        fontSize,
    },
    editIcon: {
        cursor: 'pointer',
    },
    fullWith: {
        width: '100%',
    },
    hoverContainer: {
        '&:hover': {
            '& svg': {
                opacity: 0.5,
                '&:hover': {
                    background: 'none',
                    opacity: 1,
                },
            },
        },
    },
    hideIcon: {
        opacity: 0,
    },
});

export default CRMEditableFieldStyles;
