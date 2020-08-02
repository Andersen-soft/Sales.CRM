// @flow

import {
    FONT_COLOR,
    LINK_COLOR,
    DEFAULT_BORDER_COLOR,
    WHITE,
    ACTION_LABEL,
    PRIMARY_COLOR,
    UNDERLINE,
} from 'crm-constants/jss/colors';

const cellsStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        fontWeightRegular,
        fontWeightBold,
        caption: { fontSize: captionFontSize },
        subtitle1: { lineHeight },
    },
}: Object) => ({
    cell: {
        fontSize,
        lineHeight,
    },
    cellEllipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(20),
    },
    topCell: {
        lineHeight,
        marginBottom: spacing(),
    },
    mainContact: {
        borderLeft: `3px solid ${PRIMARY_COLOR}`,
    },
    fioAndPositionCellEdited: {
        height: spacing(12.5),
        paddingTop: spacing(0.5),
    },
    fioAndPositionCell: {
        paddingLeft: 21,
        height: '100%',
    },
    fioCell: {
        color: FONT_COLOR,
        fontWeight: fontWeightRegular,
    },
    positionCell: {
        paddingLeft: spacing(2.5),
    },
    emailCell: {
        color: LINK_COLOR,
    },
    socialIcon: {
        marginRight: spacing(),
    },
    skypeCell: {
        fontSize,
        color: LINK_COLOR,
    },
    emptyBlock: {
        fontSize: captionFontSize,
        fontWeight: fontWeightLight,
        color: ACTION_LABEL,
    },
    gender: {
        'marginRight': spacing(0.75),
        'width': spacing(1.5),
        'height': spacing(2),
        '&:hover': {
            opacity: 0.5,
        },
    },
    genderIcon: {
        marginRight: spacing(2),
    },
    genderMenuButton: {
        'width': spacing(5),
        'padding': spacing(1.5, 1, 1.5, 1),
        'borderRadius': spacing(0.5),
        'backgroundColor': WHITE,
        'marginRight': spacing(),
        'border': `1px solid ${DEFAULT_BORDER_COLOR}`,
        '&:hover': {
            backgroundColor: WHITE,
        },
        'position': 'relative',
    },
    dropDownIcon: {
        position: 'absolute',
        right: -2,
        color: ACTION_LABEL,
    },
    recomendationButton: {
        'width': spacing(2),
        'height': spacing(2),
        'marginLeft': spacing(),
        'opacity': 1,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    recomendationInfo: {
        padding: spacing(),
        fontWeight: fontWeightLight,
        fontSize,
    },
    menuButton: {
        padding: 0,
    },
    link: {
        color: UNDERLINE,
        fontWeight: fontWeightBold,
    },
    dateRoot: {
        width: '100%',
        backgroundColor: WHITE,
    },
});

export default cellsStyles;
