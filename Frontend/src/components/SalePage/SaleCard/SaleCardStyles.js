// @flow

import { red, grey } from '@material-ui/core/colors';
import { BLOCK_BORDER } from 'crm-constants/jss/colors';


const SaleCardStyles = ({ typography: { fontWeightMedium }, spacing }: Object) => ({
    root: {
        padding: spacing(1.5, 3, 2, 3),
        borderRadius: spacing(),
        border: BLOCK_BORDER,
        height: '100%',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: 0,
    },
    listItem: {
        minHeight: spacing(6),
        padding: 0,
    },
    listLabel: {
        height: '100%',
        fontWeight: fontWeightMedium,
        alignSelf: 'flex-start',
    },
    firstListItemStatic: {
        display: 'flex',
        padding: 0,
    },
    title: {
        paddingTop: spacing(),
    },
    emptyBlock: {
        paddingTop: spacing(0.5),
    },
    icon: {
        textAlign: 'right',
        height: '100%',
        fontWeight: fontWeightMedium,
        alignSelf: 'flex-start',
        paddingTop: spacing(),
    },
    paddingFix: {
        padding: 0,
    },
    wrapperActivities: {
        marginBottom: spacing(),
        marginTop: spacing(),
    },
    firstListItemMoreFour: {
        display: 'flex',
        padding: spacing(),
    },
    firstListItem: {
        display: 'flex',
        paddingBottom: spacing(),
    },
    nameGrid: {
        wordWrap: 'break-word',
    },
    closeIcon: {
        'color': grey[600],
        '&:hover': {
            color: red[500],
            cursor: 'pointer',
        },
    },
});

export default SaleCardStyles;
