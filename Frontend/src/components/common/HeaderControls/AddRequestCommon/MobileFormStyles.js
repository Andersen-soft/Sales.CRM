// @flow

import { ICON_COLOR, HEADER_CELL, ERROR_COLOR, FONT_COLOR, GREY } from 'crm-constants/jss/colors';

const MobileFormStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
        caption: { fontSize },
        fontWeightLight,
    },
}: Object) => ({
    container: {
        minHeight: '100%',
        minWidth: '100vw',
        padding: spacing(7, 1, 5, 1),
        margin: 0,
    },
    withoutPadding: {
        padding: 0,
    },
    exitButton: {
        color: ICON_COLOR,
        opacity: 0.5,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 0,
        marginTop: spacing(),
        height: 60,
    },
    searchValuesWrapper: {
        position: 'absolute',
        minWidth: spacing(38),
        maxWidth: 'calc(100vw - 20px)',
        zIndex: 2000,
        maxHeight: spacing(50),
        overflowY: 'auto',
    },
    companyItem: {
        width: 'fit-content',
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${GREY} !important`,
        transform: 'translate(8px, 14px) scale(1)',
    },
    datePiker: {
        width: '100%',
        marginTop: spacing(),
        paddingBottom: spacing(2.5),
    },
    dateInput: {
        color: HEADER_CELL,
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
            padding: spacing(),
            fontSize: FONT_SIZE_NORMAL,
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
        marginBottom: spacing(),
    },
    dialogActionsBlock: {
        padding: spacing(2, 0),
    },
    buttonContainer: {
        marginRight: spacing(),
    },
    errorRsponsibleMessage: {
        color: FONT_COLOR,
        padding: spacing(9.5, 5, 14.5, 5),
    },
});

export default MobileFormStyles;
