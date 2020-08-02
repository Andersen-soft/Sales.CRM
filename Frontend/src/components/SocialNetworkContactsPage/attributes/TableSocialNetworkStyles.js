// @flow

import {
    WHITE,
    BLOCK_BORDER,
    ERROR_COLOR,
} from 'crm-constants/jss/colors';

const TableSocialNetworkStyles = ({
    spacing,
    typography: {
        fontSize,
        caption: { fontSize: fontSizeCap },
    },
}: Object) => ({
    container: {
        margin: spacing(2, 1, 0, 1),
        backgroundColor: WHITE,
        borderRadius: spacing(),
        height: '100%',
        overflow: 'hidden',
        border: BLOCK_BORDER,
    },
    headerContainer: {
        padding: spacing(3),
        position: 'sticky',
        left: 0,
        top: 0,
    },
    headerTitle: {
        fontSize: spacing(2.5),
    },
    headerSearch: {
        width: '100%',
        maxWidth: spacing(38),
        marginLeft: 'auto',
        marginRight: spacing(5),
    },
    tableContainer: {
        overflowY: 'auto',
        height: 'calc(100% - 100px)',
    },
    dialogContent: {
        width: spacing(53),
        maxWidth: spacing(53),
        borderRadius: spacing(),
    },
    dialogText: {
        paddingLeft: spacing(9.5),
        paddingRight: spacing(9.5),
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0),
        top: spacing(0),
    },
    dialogActions: {
        padding: spacing(1),
    },
    field: {
        marginBottom: spacing(3),
        zIndex: 0,
    },
    errorMessage: {
        color: ERROR_COLOR,
        fontSize: fontSizeCap,
    },
});

export default TableSocialNetworkStyles;
