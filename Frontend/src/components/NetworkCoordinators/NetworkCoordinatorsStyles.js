// @flow

import { BLOCK_BORDER, HEADER_CELL } from 'crm-constants/jss/colors';

const NetworkCoordinatorsStyles = ({
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
        maxWidth: spacing(93),
        margin: '16px auto 8px',
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

export default NetworkCoordinatorsStyles;
