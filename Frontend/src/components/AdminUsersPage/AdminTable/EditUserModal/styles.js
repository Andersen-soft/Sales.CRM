// @flow

import { FONT_COLOR } from 'crm-constants/jss/colors';

const styles = ({ spacing, typography: { body2: { fontSize } } }: Object) => ({
    container: {
        minWidth: spacing(70),
        overflowY: 'auto',
    },
    exitButton: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
    wrapper: {
        overflowY: 'auto',
        padding: spacing(2, 4, 2, 4),
    },
    title: {
        padding: 0,
    },
    content: {
        paddingTop: 0,
        marginTop: spacing(3),
    },
    row: {
        'paddingTop': '0 !important',
        'paddingBottom': '0 !important',
        '&  > div': {
            marginTop: '0 !important',
        },
    },
    email: {
        paddingTop: '20px !important',
    },
    comment: {
        marginTop: spacing(3),
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
