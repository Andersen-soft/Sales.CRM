// @flow

import {
    HEADER_CELL,
    ERROR_COLOR,
    STATUS_BORDER_COLOR,
    GREY,
    ACTION_LABEL,
} from 'crm-constants/jss/colors';

const DesktopFormStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
        caption: { fontSize },
        fontSize: fontSize14,
        fontWeightLight,
    },
}: Object) => ({
    container: {
        width: spacing(122.25),
        maxWidth: spacing(122.25),
        overflow: 'hidden',
        borderRadius: spacing(),
    },
    wrapper: {
        padding: spacing(3),
    },
    formStyle: {
        width: '100%',
    },
    blockTitle: {
        marginBottom: spacing(2),
    },
    leftContainer: {
        width: spacing(38.75),
    },
    rightContainer: {
        flex: 1,
        position: 'relative',
    },
    newCompany: {
        minHeight: spacing(17.75),
        paddingRight: spacing(5),
    },
    newContact: {
        paddingLeft: spacing(5),
    },
    devider: {
        borderLeft: `1px solid ${STATUS_BORDER_COLOR}`,
    },
    contactTitle: {
        paddingLeft: spacing(5),
    },
    rightColumnContainer: {
        paddingRight: 0,
    },
    leftColumnContainer: {
        paddingLeft: 0,
    },
    checkboxCroup: {
        width: spacing(33.75),
        marginBottom: spacing(3),
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${GREY} !important`,
        transform: 'translate(8px, 14px) scale(1)',
    },
    emptyLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    field: {
        marginBottom: spacing(3),
        zIndex: 0,
    },
    lastField: {
        marginBottom: spacing(),
        zIndex: 0,
    },
    checkboxLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    commentField: {
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
        },
        '& div': {
            padding: spacing(),
            fontSize: FONT_SIZE_NORMAL,
            height: spacing(13),
        },
    },
    commentLabel: {
        fontSize: fontSize14,
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
    buttonsContainer: {
        marginTop: 0,
        marginBottom: 0,
    },
    contactListRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        maxHeight: spacing(48),
        overflowY: 'auto',
        padding: 0,
    },
    contactItem: {
        paddingTop: 0,
        paddingBottom: 0,
        width: '50%',
    },
    actions: {
        paddingTop: spacing(2),
        paddingBottom: 0,
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    textLabel: {
        marginRight: spacing(1),
        fontSize: fontSize14,
        color: ACTION_LABEL,
    },
    emptyBlock: {
        fontSize: fontSize14,
    },
    industryList: {
        marginRight: spacing(-0.75),
    },
});

export default DesktopFormStyles;
