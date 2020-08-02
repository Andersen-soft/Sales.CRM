// @flow

import { BLOCK_BORDER, HEADER_CELL } from 'crm-constants/jss/colors';

const ReportBySocialContactsSalesHeadStyles = ({
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
        margin: spacing(2, 1.25, 0.5, 2),
        border: BLOCK_BORDER,
    },
    header: {
        padding: spacing(3, 3, 2, 3),
    },
    tableRoot: {
        overflow: 'auto',
        height: 'calc(100vh - 162px)',
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
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    messages: {
        minWidth: spacing(40),
        width: spacing(40),
        wordBreak: 'break-all',
        whiteSpace: 'pre-line',
    },
    status: {
        minWidth: spacing(17.5),
        width: spacing(17.5),
    },
    virtualProfile: {
        whiteSpace: 'pre',
    },
    company: {
        whiteSpace: 'pre',
    },
    headerItem: {
        marginLeft: spacing(5),
    },
    headerIcon: {
        marginLeft: spacing(4),
    },
    headerTitle: {
        whiteSpace: 'pre',
    },
    modalRoot: {
        borderRadius: spacing(),
        width: 400,
        paddingBottom: spacing(2),
    },
    modalTitle: {
        fontSize: 20,
        padding: spacing(3),
        marginBottom: spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    range: {
        marginBottom: spacing(2),
    },
    rangeTitle: {
        marginRight: spacing(3),
        marginLeft: spacing(3),
    },
    tableCell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
    },
    statusCell: {
        minWidth: '43%',
        width: '43%',
    },
    valueCell: {
        textAlign: 'center',
    },
});

export default ReportBySocialContactsSalesHeadStyles;
