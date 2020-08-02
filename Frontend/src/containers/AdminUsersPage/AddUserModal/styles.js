// @flow

import red from '@material-ui/core/colors/red';
import { FONT_COLOR } from 'crm-constants/jss/colors';

const styles = ({ spacing, typography: { body2: { fontSize } } }: Object) => ({
    container: {
        minWidth: 560,
        overflowY: 'auto',
    },
    exitButton: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
    hint: {
        marginTop: spacing(),
        paddingLeft: spacing(3),
        paddingRight: spacing(3),
    },
    wrapper: {
        overflowY: 'auto',
        padding: spacing(2, 4, 2, 4),
    },
    title: {
        padding: 0,
    },
    row: {
        'paddingTop': '0 !important',
        'paddingBottom': '0 !important',
        'width': '100%',
        '&  > div': {
            marginTop: '0 !important',
        },
    },
    searchInput: {
        position: 'relative',
        width: '100%',
    },
    searchValuesWrapper: {
        position: 'absolute',
        top: '100%',
        minWidth: 300,
        maxWidth: spacing(75),
        zIndex: 2000,
        maxHeight: 400,
        overflowY: 'auto',
    },
    clearSearch: {
        '&:hover': {
            cursor: 'pointer',
            color: red[500],
        },
    },
    time: {
        display: 'flex',
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginTop: spacing(),
        marginBottom: spacing(),
    },
    select: {
        marginTop: spacing(),
        marginBottom: spacing(2),
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        position: 'relative',
    },
    actions: {
        marginTop: spacing(6),
    },
    buttonCancel: {
        marginRight: 0,
    },
    input: {
        fontSize,
    },
    leadAllocation: {
        marginTop: spacing(),
    },
    checkbox: {
        fontSize,
        color: FONT_COLOR,
    },
    buttonAdd: {
        width: spacing(4),
        height: spacing(4),
    },
    additionalEmails: {
        '& p': {
            marginBottom: spacing(),
        },
    },
    emailGroup: {
        marginTop: spacing(2),
        padding: spacing(2),
    },
});

export default styles;
