// @flow

import { red } from '@material-ui/core/colors';
import { HEADER_CELL } from 'crm-constants/jss/colors';

const CRMAutocompleteInputStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
    },
}: Object) => ({
    root: {
        flexGrow: 1,
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${HEADER_CELL} !important`,
        transform: 'translate(14px, 14px) scale(1)',
    },
    outlined: {
        transform: 'translate(14px, 14px) scale(1)',
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        top: spacing(6),
        zIndex: 2,
        maxHeight: 300,
        width: '100%',
        overflowY: 'auto',
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: spacing(2),
    },
    errorMessage: {
        position: 'absolute',
        color: red[500],
    },
});

export default CRMAutocompleteInputStyles;
