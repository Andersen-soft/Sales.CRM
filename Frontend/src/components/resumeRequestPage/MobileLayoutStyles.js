// @flow

import { WHITE, HEADER_CELL, FONT_COLOR } from 'crm-constants/jss/colors';

const MobileLayoutStyles = ({
    spacing,
    typography: {
        htmlFontSize,
        fontSize,
        fontWeightLight,
        subtitle1: { lineHeight },
    },
}: Object) => ({
    container: {
        width: '100%',
        height: '100%',
        background: WHITE,
    },
    swipeContainer: {
        height: '100%',
        paddingBottom: '79px',
    },
    swipe: {
        height: '100%',
    },
    headerRow: {
        height: spacing(5),
    },
    idResume: {
        color: HEADER_CELL,
        fontSize: htmlFontSize,
        lineHeight,
        fontWeight: fontWeightLight,
        marginLeft: spacing(),
    },
    deleteButton: {
        'marginLeft': spacing(),
        'padding': 0,
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    tabHeader: {
        'marginTop': spacing(),
        'position': 'relative',
        '&:after, &:before': {
            position: 'absolute',
            top: 0,
            content: '""',
            height: spacing(3.5),
            width: spacing(2),
            background: `linear-gradient(90deg, rgba(255,255,255, 0.1), ${WHITE})`,
        },
        '&:after': {
            right: 0,
        },
        '&:before': {
            left: 0,
            zIndex: 1,
            background: `linear-gradient(270deg, rgba(255,255,255, 0.1), ${WHITE})`,
        },
    },
    tabLabel: {
        height: spacing(4),
        minHeight: spacing(4),
        overflow: 'unset',
    },
    tabLabelSelected: {
        '& > span': {
            color: FONT_COLOR,
        },
    },
    labelWrapper: {
        fontSize: `${fontSize}px !important`,
        fontWeight: 'normal',
        color: HEADER_CELL,
    },
    tabsRoot: {
        height: spacing(4),
        minHeight: spacing(4),
        borderBottom: 'unset',
        boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.02)',
    },
    tabBadge: {
        right: spacing(-0.5),
    },
    indicator: {
        '& > div': {
            maxWidth: '85%',
        },
    },
    tabContentWrapper: {
        overflowY: 'auto',
        height: '100%',
    },
});

export default MobileLayoutStyles;
