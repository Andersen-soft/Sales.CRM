// @flow

import { WHITE, BLOCK_BORDER } from 'crm-constants/jss/colors';

const ReportByActivitiesPageStyle = ({ spacing }: Object) => ({
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
    tableContainer: {
        overflowY: 'auto',
        height: 'calc(100% - 100px)',
    },
    filerWrapper: {
        width: spacing(35),
    },
    download: {
        marginLeft: spacing(2),
    },
});

export default ReportByActivitiesPageStyle;
