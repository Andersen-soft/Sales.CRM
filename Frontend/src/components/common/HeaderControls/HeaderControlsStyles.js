// @flow

import {
    HOVER_BACKGROUND_COLOR,
    FONT_COLOR,
    HEADER_CELL,
} from 'crm-constants/jss/colors';

const HeaderControlsStyles = ({ spacing, typography: { fontSize } }: Object) => ({
    menuWrapper: {
        zIndex: 4,
    },
    controlsWrapper: {
        width: 'max-content',
    },
    mobileControlsWrapper: {
        width: '100%',
    },
    iconButton: {
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    mobileIconButton: {
        padding: 0,
    },
    subMenuRadius: {
        borderRadius: spacing(),
    },
    mobileSubMenuItem: {
        color: HEADER_CELL,
        display: 'flex',
    },
    link: {
        color: FONT_COLOR,
    },
    popupMenuItem: {
        display: 'flex',
        '&:hover': {
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
    },
    popupMenuText: {
        fontSize,
        paddingLeft: spacing(1.25),
    },
});

export default HeaderControlsStyles;

