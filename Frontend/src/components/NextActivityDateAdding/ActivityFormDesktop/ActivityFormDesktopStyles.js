// @flow

import commonStyles from 'crm-styles/common';

import { FONT_COLOR } from 'crm-constants/jss/colors';

const ActivityFormDesktopStyles = ({
    spacing,
    typography: {
        fontSize,
        h5: { fontSize: h5FontSize },
    },
}: Object) => ({
    root: {
        padding: spacing(4),
        borderRadius: spacing(),
    },
    dateRoot: {
        width: spacing(22),
    },
    dateInput: {
        color: `${FONT_COLOR} !important`,
    },
    typeActivityLabel: {
        display: 'block',
        whiteSpace: 'nowrap',
        marginBottom: spacing(2),
    },
    nextActivityBlock: {
        marginTop: spacing(5.25),
    },
    activityDateBlock: {
        marginTop: spacing(5.25),
    },
    title: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: spacing(4.5),
        fontSize: h5FontSize,
    },
    checkboxLabel: {
        fontSize,
        marginLeft: spacing(),
    },
    saveBtn: {
        marginLeft: spacing(3),
    },
    activityContainer: {
        zIndex: 1,
    },
    actions: {
        paddingBottom: 0,
        paddingLeft: 0,
        paddingTop: spacing(5),
    },
    confirmationButton: {
        width: spacing(22.5),
    },
    closeButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    comment: {
        fontSize,
        paddingTop: spacing(2),
    },
    ...commonStyles,
});

export default ActivityFormDesktopStyles;
