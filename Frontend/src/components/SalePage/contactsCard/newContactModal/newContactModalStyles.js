// @flow

import { FONT_COLOR, LIGHTGRAY } from 'crm-constants/jss/colors';
import { FONT_SIZE_H3, FONT_SIZE_NORMAL } from 'crm-constants/jss/fonts';

const newContactModalStyles = ({ spacing }: Object) => ({
    buttonsContainer: {
        paddingTop: spacing(2),
        paddingBottom: spacing(2),
    },
    buttonStyles: {
        marginRight: spacing(6),
    },
    headerWrapper: {
        backgroundColor: LIGHTGRAY,
    },
    title: {
        fontSize: FONT_SIZE_H3,
        marginBottom: spacing(0.5),
    },
    paperContainer: {
        overflowY: 'initial',
        maxWidth: spacing(78.5),
        padding: spacing(),
    },
    root: {
        borderRadius: spacing(),
    },
    exitButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    actions: {
        marginTop: spacing(2),
    },
    field: {
        paddingLeft: spacing(2.5),
    },
    switchLabel: {
        fontSize: FONT_SIZE_NORMAL,
        color: FONT_COLOR,
    },
    warning: {
        marginTop: spacing(1),
        paddingLeft: spacing(2.5),
    },
});

export default newContactModalStyles;
