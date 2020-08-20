// @flow

import { ACTION_LABEL, GREY_LIGHT } from 'crm-constants/jss/colors';

const UploadFileStyles = ({ spacing, typography: { fontSize } }: Object) => ({
    menuItem: {
        '&:hover': {
            background: GREY_LIGHT,
        },
        padding: spacing(2),
        cursor: 'pointer',
    },
    icon: {
        marginRight: spacing(),
    },
    labelFile: {
        fontSize,
        color: ACTION_LABEL,
        cursor: 'pointer',
    },
    hidden: {
        display: 'none',
    },
    pointer: {
        cursor: 'pointer',
    },
});

export default UploadFileStyles;
