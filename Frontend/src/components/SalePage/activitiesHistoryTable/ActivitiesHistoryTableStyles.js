// @flow
import { BLOCK_BORDER } from 'crm-constants/jss/colors';

const ActivitiesHistoryTableStyles = ({
    spacing,
    typography: {
        fontWeightRegular,
        caption: { lineHeight: lineHeight166 },
        body2: { lineHeight },
    },
}: Object) => ({
    root: {
        borderRadius: spacing(),
        border: BLOCK_BORDER,
    },
    wrapTable: {
        height: '100%',
        overflowY: 'auto',
    },
    row: {
        height: spacing(6.5),
    },
    headerWrapper: {
        padding: spacing(2, 2, 0.5, 3),
    },
    search: {
        marginRight: spacing(5),
    },
    cell: {
        verticalAlign: 'top',
        padding: spacing(2, 0, 2, 2),
    },
    description: {
        lineHeight,
        paddingLeft: spacing(3),
    },
    responsible: {
        width: '12%',
    },
    contacts: {
        width: '13%',
    },
    types: {
        width: '12%',
        minWidth: spacing(16.5),
    },
    dateActivity: {
        width: '12%',
    },
    actions: {
        width: spacing(6),
        maxWidth: spacing(6),
        paddingRight: `${spacing()}px !important`,
        paddingLeft: `${spacing(0.5)}px !important`,
        paddingTop: spacing(2),
    },
    menuButton: {
        padding: 0,
    },
    head: {
        height: spacing(4.5),
    },
    headerCell: {
        fontWeight: fontWeightRegular,
        lineHeight: lineHeight166,
    },
});

export default ActivitiesHistoryTableStyles;
