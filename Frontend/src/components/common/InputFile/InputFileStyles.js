// @flow

import { HEADER_CELL, ICON_COLOR } from 'crm-constants/jss/colors';

const InputFileStyles = ({
    spacing,
    typography: {
        caption: { fontSize },
        fontWeightLight,
    },
}: Object) => ({
    title: {
        paddingTop: spacing(0.5),
        paddingLeft: spacing(),
    },
    fileRow: {
        marginTop: spacing(),
    },
    files: {
        fontSize,
        color: HEADER_CELL,
    },
    deleteButton: {
        'padding': 0,
        'marginLeft': spacing(),
        'color': HEADER_CELL,
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    attachButton: {
        transform: 'rotate(-30deg)',
        cursor: 'pointer',
    },
    labelFile: {
        'color': HEADER_CELL,
        'cursor': 'pointer',
        fontSize,
        '&:hover': {
            color: ICON_COLOR,
        },
    },
    message: {
        fontWeight: fontWeightLight,
    },
    inputFile: {
        display: 'none',
    },
});

export default InputFileStyles;
