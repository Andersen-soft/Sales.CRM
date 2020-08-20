// @flow

import {
    FONT_COLOR,
    HEADER_CELL,
    UNDERLINE,
    ICON_COLOR,
    WHITE,
    GREY,
    TRANSPARENT_WHITE,
} from 'crm-constants/jss/colors';

const AttributesStyles = ({
    typography: {
        fontSize,
        fontWeightLight,
        fontWeightMedium,
        subtitle1: { lineHeight },
        caption: { fontSize: fontSizeSmall },
        h6: { fontSize: fontSizeH6 },
        body2: { lineHeight: lineHeightBody },
        htmlFontSize,
    },
    spacing,
    mixins: { mobile },
}: Object) => ({
    label: {
        fontSize,
        lineHeight,
        color: HEADER_CELL,
        marginRight: spacing(),
    },
    value: {
        flexGrow: 1,
        maxWidth: spacing(27),
    },
    withoutEdit: {
        paddingRight: spacing(4),
    },
    date: {
        fontSize,
    },
    inlineDisableDate: {
        'borderBottom': 'unset',
        '&:hover': {
            cursor: 'unset',
            opacity: 1,
        },
    },
    formControl: {
        width: '100%',
        paddingBottom: spacing(1.125),
    },
    commentField: {
        'marginTop': spacing(),
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
            fontSize,
        },
        '& div': {
            padding: spacing(),
            fontSize,
        },
    },
    commentInput: {
        color: 'inherit !important',
        fontWeight: fontWeightLight,
        fontSize: fontSizeSmall,
    },
    fullName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        height: spacing(2.5),
    },
    listLabel: {
        height: spacing(5),
        alignSelf: 'flex-start',
    },
    source: {
        marginRight: spacing(),
    },
    recommendationLabel: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        height: spacing(2.5),
    },
    recommendationInfo: {
        padding: spacing(1.5),
    },
    recommendationInfoPaper: {
        width: spacing(35.5),
    },
    recommendationTitle: {
        marginBottom: spacing(2),
    },
    fieldName: {
        fontSize: fontSizeSmall,
        color: HEADER_CELL,
        marginBottom: spacing(),
    },
    fieldValue: {
        fontSize: fontSizeSmall,
        color: FONT_COLOR,
        marginBottom: spacing(2),
    },
    deleteIcon: {
        'max-height': spacing(3),
        'max-width': spacing(2),
        'opacity': 0.5,
        'margin-left': spacing(0),
        'padding-left': spacing(0),
        'color': ICON_COLOR,
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: 0,
    },
    firstListItemStatic: {
        display: 'flex',
        padding: 0,
    },
    title: {
        color: HEADER_CELL,
        fontSize,
        paddingTop: spacing(0),
        minWidth: 'max-content',
    },
    wrapperActivities: {
        marginBottom: spacing(),
        marginTop: spacing(),
    },
    wrapperArrowDropdown: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        height: '100%',
        textAlign: 'right',
        marginTop: spacing(),
        alignSelf: 'flex-start',
        fontWeight: fontWeightMedium,
    },
    positionFix: {
        padding: 0,
        height: '100%',
        right: 0,
        position: 'absolute',
    },
    showAllButtonContainer: {
        borderRadius: 0,
        pointerEvents: 'none',
        paddingLeft: spacing(10),
        background: `linear-gradient(90deg, ${TRANSPARENT_WHITE}, ${WHITE})`,
        '&:hover': {
            background: `linear-gradient(90deg, ${TRANSPARENT_WHITE}, ${WHITE})`,
        },
    },
    showAllButton: {
        radius: 20,
        color: GREY,
        pointerEvents: 'visiblePainted',
    },
    wrapperTags: {
        width: spacing(60),
        marginTop: spacing(2),
        marginRight: spacing(2),
        marginBottom: 0,
        marginLeft: spacing(2),
        paddingBottom: spacing(1),
        paddingRight: spacing(2),
        overflow: 'auto',
    },
    popupAdd: {
        marginLeft: spacing(2),
        '&:hover': {
            background: WHITE,
        },
    },
    wrapperTagList: {
        width: spacing(50),
        marginLeft: spacing(),
    },
    overflowList: {
        overflow: 'hidden',
        minHeight: spacing(4),
        marginRight: spacing(3),
    },
    overflowFix: {
        overflow: 'auto',
    },
    moreButton: {
        paddingTop: spacing(0.5),
    },
    emptyBlock: {
        paddingRight: spacing(),
        zIndex: 1,
    },
    modalRoot: {
        margin: spacing(),
        borderRadius: spacing(),
        paddingTop: spacing(),
        width: spacing(73),
    },
    text: {
        fontSize: fontSizeH6,
        marginBottom: spacing(),
    },
    contentText: {
        fontSize: htmlFontSize,
        fontWeight: fontWeightLight,
        lineHeight: lineHeightBody,
        marginBottom: spacing(3),
    },
    actions: {
        padding: spacing(4, 1, 5, 1),
    },
    buttonContainer: {
        marginRight: spacing(2),
        ...mobile({
            marginRight: spacing(),
            marginBottom: spacing(),
        }),
    },
});

export default AttributesStyles;
