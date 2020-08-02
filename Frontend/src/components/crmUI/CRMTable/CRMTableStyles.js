// @flow

import {
    HEADER_CELL,
    ROW_HOVER,
    GREY_LIGHT,
    STATUS_BORDER_COLOR,
    TRANSPARENT_TABLE_ROW_SELECTED,
} from 'crm-constants/jss/colors';

const CRMTableStyles = ({
    spacing,
    typography: {
        subtitle1: { fontSize },
        h5: { lineHeight },
        fontWeightLight,
        subtitle2: { fontSize: smallFontSize },
    },
}: Object) => ({
    root: {
        width: '100%',
        overflow: 'auto',
        position: 'relative',
    },
    tableRoot: {
        borderCollapse: 'unset',
    },
    head: {
        height: spacing(5.5),
    },
    headerCell: {
        color: HEADER_CELL,
        borderBottomColor: STATUS_BORDER_COLOR,
    },
    cell: {
        fontSize,
        fontWeight: fontWeightLight,
        borderBottomColor: STATUS_BORDER_COLOR,
    },
    row: {
        height: spacing(7),
    },
    rowHover: {
        '&:hover': {
            backgroundColor: ROW_HOVER,
        },
    },
    rowSelected: {
        backgroundColor: TRANSPARENT_TABLE_ROW_SELECTED,
    },
    oddRow: {
        backgroundColor: GREY_LIGHT,
    },
    center: {
        textAlign: 'center',
    },
    error: {
        fontSize: spacing(2.25),
        lineHeight,
        fontWeight: fontWeightLight,
        color: HEADER_CELL,
        border: 'none',
        padding: spacing(3, 0),
    },
    title: {
        marginRight: spacing(),
    },
    radiusLastRow: {
        '& tbody tr:last-child td:first-child': {
            borderBottomLeftRadius: spacing(),
        },
        '& tbody tr:last-child td:last-child': {
            borderBottomRightRadius: spacing(),
        },
    },
    withOutBorder: {
        borderBottom: 'unset',
    },
    infoRow: {
        position: 'absolute',
        paddingTop: spacing(),
    },
    rowCount: {
        borderBottom: 'unset',
        color: HEADER_CELL,
        fontWeight: fontWeightLight,
        fontSize: smallFontSize,
    },
});

export default CRMTableStyles;
