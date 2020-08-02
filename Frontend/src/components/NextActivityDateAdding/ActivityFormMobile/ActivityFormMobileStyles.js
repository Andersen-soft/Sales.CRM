// @flow

import { HEADER_CELL, ICON_COLOR } from 'crm-constants/jss/colors';

const ActivityFormMobileStyles = ({ spacing, typography: { fontSize } }: Object) => ({
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
    row: {
        marginTop: spacing(2),
    },
    labelHeaderSection: {
        marginTop: spacing(1.5),
        marginBottom: spacing(1.5),
        fontSize,
    },
    label: {
        fontSize,
    },
    commentField: {
        'marginTop': spacing(),
        'height': spacing(14),
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
        },
        '& div': {
            padding: spacing(),
            fontSize,
        },
    },
    commentLabel: {
        fontSize,
        color: HEADER_CELL,
    },
    dialogActionsBlock: {
        padding: spacing(0, 0, 2, 0),
    },
    buttonContainer: {
        marginRight: spacing(),
    },
    dateInput: {
        color: HEADER_CELL,
    },
});

export default ActivityFormMobileStyles;
