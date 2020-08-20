// @flow

import {
    ICON_COLOR,
    HEADER_CELL,
    ERROR_COLOR,
    GREY,
    WHITE,
    DEFAULT_BORDER_COLOR,
    HOVER_BACKGROUND_COLOR,
} from 'crm-constants/jss/colors';

const MobileFormStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
        caption: { fontSize },
        fontWeightLight,
        subtitle2: {
            fontSize: smallFontSize,
        },
    },
}: Object) => ({
    container: {
        minHeight: '100%',
        minWidth: '100vw',
        padding: spacing(7, 1, 5, 1),
        margin: 0,
    },
    topContainer: {
        width: '100%',
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
        height: spacing(7.5),
    },
    staticValue: {
        width: '100%',
        marginBottom: 0,
        height: spacing(5.5),
    },
    firstStataticValue: {
        height: spacing(4),
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${GREY} !important`,
        transform: 'translate(8px, 14px) scale(1)',
    },
    commentLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    commentField: {
        'marginTop': spacing(),
        'marginBottom': spacing(2),
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
    buttonContainer: {
        marginRight: spacing(),
    },
    buttonWrapper: {
        height: spacing(5),
        borderRadius: spacing(),
        backgroundColor: HOVER_BACKGROUND_COLOR,
        paddingLeft: 2,
        paddingRight: 2,
        boxSizing: 'content-box',
        marginBottom: spacing(3),
    },
    button: {
        'height': spacing(4.5),
        'fontSize': smallFontSize,
        'padding': 0,
        'textTransform': 'unset',
        'fontWeight': 'normal',
        'borderRadius': spacing(),
        '&:hover': {
            backgroundColor: WHITE,
            border: `1px solid ${DEFAULT_BORDER_COLOR}`,
        },
        'flexGrow': 1,
    },
    activeButton: {
        backgroundColor: WHITE,
        border: `1px solid ${DEFAULT_BORDER_COLOR}`,
    },
    title: {
        fontSize: FONT_SIZE_NORMAL,
        marginBottom: spacing(1),
    },
    subTitle: {
        fontSize: FONT_SIZE_NORMAL,
        marginBottom: spacing(3),
    },
    textLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    mobileFooter: {
        marginBottom: spacing(),
    },
    rightColumnContainer: {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: spacing(3),
        maxWidth: '100%',
        flexBasis: '100%',
    },
    leftColumnContainer: {
        paddingLeft: 0,
        paddingRight: 0,
        maxWidth: '100%',
        flexBasis: '100%',
    },
    firstButton: {
        '&:hover': {
            backgroundColor: 'unset',
            borderColor: 'unset',
        },
    },
    industryList: {
        marginRight: spacing(-0.75),
    },
});

export default MobileFormStyles;
