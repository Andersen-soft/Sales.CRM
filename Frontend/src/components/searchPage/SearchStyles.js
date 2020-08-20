// @flow

import { BLOCK_BORDER, HEADER_CELL } from 'crm-constants/jss/colors';

export default ({
    spacing,
    typography: {
        fontSize,
        h6: { fontSize: fontSizeH6 },
    },
}: Object) => ({
    container: {
        height: '100%',
        overflowY: 'auto',
        margin: spacing(2, 1.25, 0.5, 2),
        border: BLOCK_BORDER,
    },
    rounded: {
        borderRadius: spacing(),
    },
    paddingRow: {
        padding: spacing(3, 3, 0, 3),
    },
    radioRow: {
        paddingLeft: spacing(3),
        paddingRight: spacing(),
    },
    headerTitle: {
        fontSize: fontSizeH6,
    },
    radioGroupTitle: {
        fontSize,
        color: HEADER_CELL,
        paddingTop: spacing(1.5),
        paddingRight: spacing(2),
    },
    checkboxLabel: {
        fontSize,
    },
    inputWrapper: {
        marginRight: spacing(5),
        width: spacing(30),
        marginBottom: spacing(3),
    },
    industryWrapper: {
        marginRight: spacing(5),
        minWidth: spacing(30),
        maxWidth: spacing(65),
        marginBottom: spacing(3),
    },
    buttonRow: {
        marginBottom: spacing(2),
    },
    link: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    button: {
        marginRight: spacing(4),
    },
});
