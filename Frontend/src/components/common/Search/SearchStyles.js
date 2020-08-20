// @flow

import { red } from '@material-ui/core/colors';

const SearchStyles = ({ spacing } : Object) => ({
    reportsUploadWrapper: {
        marginTop: spacing(),
    },
    searchField: {
        width: spacing(34),
        margin: spacing(2),
    },
    top: {
        flexWrap: 'nowrap',
        position: 'sticky',
        left: 0,
    },
    clearButton: {
        '&:hover': {
            cursor: 'pointer',
            color: red[500],
        },
    },
});

export default SearchStyles;
