// @flow

import { BLOCK_BORDER, HEADER_CELL } from 'crm-constants/jss/colors';

const AllEstimationRequestStyles = ({
    spacing,
    typography: {
        fontWeightRegular: fontWeight,
        fontSize,
    },
}: Object) => ({
    container: {
        height: '100%',
        overflow: 'hidden',
        margin: spacing(2, 1.25, 0.5, 2),
        border: BLOCK_BORDER,
    },
    wrapTable: {
        height: '100%',
        overflow: 'auto',
    },
    tableRoot: {
        overflow: 'unset',
    },
    rounded: {
        borderRadius: spacing(),
    },
    wrapPadding: {
        paddingBottom: spacing(5),
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
    title: {
        fontWeight,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
        whiteSpace: 'pre',
    },
    topBarContainer: {
        padding: spacing(2, 2, 0, 2),
    },
    iconButton: {
        padding: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
});

export default AllEstimationRequestStyles;
