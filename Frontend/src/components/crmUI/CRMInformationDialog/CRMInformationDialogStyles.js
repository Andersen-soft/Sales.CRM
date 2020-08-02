// @flow

import { HEADER_CELL } from 'crm-constants/jss/colors';

const CRMInformationDialogStyles = ({ spacing, zIndex, typography: { caption: { fontSize } } }: Object) => ({
    root: {
        zIndex: `${zIndex.modal + 1} !important`,
    },
    paper: {
        margin: spacing(),
        whiteSpace: 'pre-line',
    },
    paperFullWidth: {
        width: '100%',
    },
    paperWidthFalse: {
        maxWidth: 'unset',
    },
    closeButton: {
        color: HEADER_CELL,
        fontSize,
        textTransform: 'unset',
        fontWeight: 'normal',
    },
    contentRoot: {
        paddingTop: spacing(2),
        paddingBottom: 0,
    },
    actionRoot: {
        paddingTop: 0,
    },
});

export default CRMInformationDialogStyles;
