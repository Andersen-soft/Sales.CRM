// @flow

import {
    HOVER_BACKGROUND_COLOR,
    FONT_COLOR,
    PRIMARY_COLOR,
    BLACK,
} from 'crm-constants/jss/colors';

const HeaderMenuStyles = ({ typography: { body1: { fontSize } }, spacing }: Object) => ({
    item: {
        color: FONT_COLOR,
        fontSize,
        boxSizing: 'border-box',
        lineHeight: `${spacing(2)}px`,
        transition: 'none',
        height: spacing(7),
        '&:hover': {
            backgroundColor: 'unset',
        },
        '&:focus': {
            backgroundColor: 'unset',
        },
    },
    mobileItem: {
        '&:hover': {
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
        height: spacing(6),
    },
    subTitle: {
        '&:hover': {
            borderRadius: spacing(0.5),
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
    },
    subItem: {
        overflow: 'inherit',
    },
    subMenuItem: {
        '&:hover': {
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
        color: BLACK,
    },
    list: {
        display: 'flex',
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: spacing(7),
    },
    title: {
        paddingTop: spacing(1.5),
        paddingBottom: spacing(1.5),
        paddingLeft: spacing(2),
        paddingRight: spacing(2),
        '&:hover': {
            borderRadius: spacing(0.5),
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
    },
    mobileTitle: {
        '&:hover': {
            borderRadius: 'unset',
            backgroundColor: 'unset',
        },
        paddingLeft: 0,
    },
    menuItemWrapper: {
        '&:focus': {
            outline: 'none',
        },
    },
    subMenu: {
        zIndex: 4,
        top: '-5px !important',
    },
    subMenuRadius: {
        borderRadius: spacing(),
    },
    selected: {
        borderBottomWidth: 3,
        borderStyle: 'solid',
        borderColor: PRIMARY_COLOR,
        background: 'inherit !important',
    },
    mobileMenu: {
        width: '100%',
    },
    mobileSelected: {
        borderLeftWidth: 3,
        borderStyle: 'solid',
        borderColor: PRIMARY_COLOR,
        backgroundColor: `${HOVER_BACKGROUND_COLOR} !important`,
        paddingLeft: 13,
    },
    mobileSubItem: {
        height: '100%',
        padding: 0,
    },
    expansionRoot: {
        border: 'unset',
        boxShadow: 'unset',
        width: '100%',
    },
    expansionExpanded: {
        margin: '0 !important',
    },
    expansionSummaryRoot: {
        minHeight: `${spacing(6)}px !important`,
        height: spacing(6),
        justifyContent: 'flex-start',
        paddingLeft: spacing(2),
    },
    expansionSummaryContent: {
        flexGrow: 'unset',
    },
    expansionDetailsRoot: {
        padding: 0,
    },
    mobileSubList: {
        width: '100%',
        padding: 0,
    },
    mobileSubMenuItem: {
        paddingLeft: spacing(5),
        '&:hover': {
            backgroundColor: HOVER_BACKGROUND_COLOR,
        },
    },
    mobilePageTitle: {
        paddingLeft: spacing(2),
    },
    noLink: {
        color: 'inherit',
    },
});

export default HeaderMenuStyles;
