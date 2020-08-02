// @flow

import { BLOCK_BORDER, FONT_COLOR, HEADER_CELL, UNDERLINE } from 'crm-constants/jss/colors';

const NetworkCoordinatorsSalesHeadStyles = ({
    spacing,
    typography: {
        fontSize,
        h6: { fontSize: fontSizeH6 },
        fontWeightRegular: fontWeight,
    },
}: Object) => ({
    container: {
        height: '100%',
        overflow: 'hidden',
        border: BLOCK_BORDER,
        margin: spacing(2, 1, 1, 1),
        paddingTop: spacing(3),
    },
    rounded: {
        borderRadius: spacing(),
    },
    title: {
        paddingLeft: spacing(3),
        paddingBottom: spacing(3),
        fontSize: fontSizeH6,
    },
    underlineName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        height: spacing(2.5),
    },
    dateItem: {
        marginRight: spacing(4),
        width: spacing(24),
    },
    iconButton: {
        marginRight: spacing(2),
    },
    tableRoot: {
        height: 'calc(100vh - 160px)',
    },
    cell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
    },
    head: {
        height: spacing(5),
    },
    headerCell: {
        '& >div': {
            flexWrap: 'nowrap',
            height: spacing(3),
        },
    },
    headTitle: {
        fontWeight,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
        whiteSpace: 'pre',
    },
});

export default NetworkCoordinatorsSalesHeadStyles;
