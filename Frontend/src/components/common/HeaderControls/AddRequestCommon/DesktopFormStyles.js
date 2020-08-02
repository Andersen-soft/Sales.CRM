// @flow

import { HEADER_CELL, ERROR_COLOR, FONT_COLOR, GREY } from 'crm-constants/jss/colors';
import { FONT_SIZE_H3 } from 'crm-constants/jss/fonts';

const DesktopFormStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
        caption: { fontSize },
        fontWeightLight,
    },
}: Object) => ({
    container: {
        width: spacing(79),
        maxWidth: spacing(79),
        borderRadius: spacing(),
    },
    wrapper: {
        padding: spacing(3),
    },
    title: {
        padding: spacing(0, 0, 3, 0),
        fontSize: FONT_SIZE_H3,
    },
    errorMessage: {
        marginBottom: spacing(),
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    content: {
        padding: 0,
        overflowY: 'unset',
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${GREY} !important`,
        transform: 'translate(8px, 14px) scale(1)',
    },
    inputWrapper: {
        width: '100%',
        marginTop: spacing(0.5),
        height: 60,
    },
    searchValuesWrapper: {
        position: 'absolute',
        minWidth: spacing(37.5),
        maxWidth: spacing(75),
        zIndex: 2000,
        maxHeight: spacing(37.5),
        overflowY: 'auto',
    },
    datePiker: {
        width: '100%',
        marginTop: spacing(),
        paddingBottom: 20,
    },
    dateInput: {
        color: FONT_COLOR,
    },
    priorityRow: {
        paddingTop: spacing(0.5),
        height: spacing(7.5),
    },
    priorityTitle: {
        fontSize,
        color: HEADER_CELL,
        paddingTop: spacing(1.5),
    },
    checkboxLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    commentLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    commentField: {
        'marginTop': spacing(),
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
        },
        '& div': {
            padding: spacing(2, 1, 1, 1),
            fontSize: FONT_SIZE_NORMAL,
            height: spacing(13.5),
        },
    },
    bigCommentField: {
        '& div': {
            height: spacing(21),
        },
    },
    commentMessage: {
        fontSize,
        fontWeight: fontWeightLight,
        color: HEADER_CELL,
    },
    commentError: {
        color: ERROR_COLOR,
        textAlign: 'left',
        marginTop: spacing(),
    },
    fullWidth: {
        width: '100%',
    },
    dialogActions: {
        marginTop: spacing(3.5),
    },
});

export default DesktopFormStyles;
