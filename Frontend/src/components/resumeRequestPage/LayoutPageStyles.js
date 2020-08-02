// @flow

import { BLOCK_BORDER } from 'crm-constants/jss/colors';

const LayoutPageStyles = ({ spacing, typography: { fontSize } }: Object) => ({
    container: {
        padding: spacing(2, 1.25),
        width: '100%',
    },
    scroll: {
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
    },
    rowContainer: {
        width: '100%',
        flexWrap: 'nowrap',
        paddingBottom: spacing(2),
    },
    blockContainer: {
        border: BLOCK_BORDER,
        borderRadius: spacing(),
        overflow: 'hidden',
    },
    requestCard: {
        marginRight: spacing(2),
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    headerRounded: {
        borderRadius: spacing(),
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    contentRounded: {
        borderRadius: spacing(),
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },
    tabContentWrapper: {
        height: '100%',
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden',
    },
    tabContainer: {
        height: '100%',
    },
    badge: {
        paddingRight: spacing(2),
    },
    label: {
        fontSize,
    },
    tableContainer: {
        marginBottom: spacing(2),
        border: BLOCK_BORDER,
        borderRadius: spacing(),
    },
});

export default LayoutPageStyles;
