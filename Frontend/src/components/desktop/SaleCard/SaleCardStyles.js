// @flow

import { HEADER_CELL, FONT_COLOR, LINK_COLOR } from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';

import { MAX_DESCRIPTION_HEIGHT } from './constants';

const SaleCardStyles = ({ spacing, typography: { fontSize } }: Object) => ({
    root: {
        padding: spacing(2.5),
        boxShadow: 'unset',
    },
    companyBlock: {
        paddingRight: spacing(2),
        minWidth: spacing(35),
    },
    responsible: {
        paddingRight: spacing(2),
        minWidth: spacing(28),
    },
    companyInfo: {
        position: 'relative',
        paddingRight: spacing(2),
    },
    nextActivityBlock: {
        minWidth: spacing(30),
    },
    fullWidth: {
        width: '100%',
    },
    nextActivityWrapper: {
        marginBottom: spacing(1.5),
    },
    smallSubHeader: {
        color: HEADER_CELL,
        fontSize: FONT_SIZE_SMALL,
        marginTop: spacing(0.5),
    },
    fieldMargin: {
        marginTop: spacing(),
        width: '100%',
    },
    ellipsisUrl: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    link: {
        color: LINK_COLOR,
    },
    skype: {
        width: '100%',
        paddingBottom: spacing(),
    },
    icon: {
        marginRight: spacing(),
        opacity: 1,
    },
    date: {
        fontSize,
    },
    lastActivityBlock: {
        'maxHeight': spacing(19),
        'overflow': 'hidden',
        'paddingRight': spacing(2),
        '& $smallSubHeader': {
            marginTop: spacing(0.5),
            marginBottom: spacing(),
        },
    },
    lastActivityDescription: {
        'maxHeight': MAX_DESCRIPTION_HEIGHT,
        'overflow': 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    readMode: {
        fontSize: FONT_SIZE_SMALL,
        display: 'block',
        marginTop: spacing(),
    },
    nextActivity: {
        'marginTop': 0,
        'marginBottom': 0,
        '& $smallSubHeader': {
            display: 'inline-block',
            marginTop: 0,
            marginBottom: 0,
            marginRight: spacing(),
        },
    },
    socialIcon: {
        marginRight: spacing(),
    },
    descriptionPopover: {
        maxHeight: spacing(40),
        padding: spacing(),
        borderRadius: spacing(),
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    inlineBlock: {
        display: 'inline-block',
    },
    noData: {
        width: spacing(20),
    },
    saleLink: {
        fontWeight: 400,
        color: FONT_COLOR,
        '&:hover': { color: LINK_COLOR },
    },
    lightFont: {
        fontWeight: 300,
    },
    disableIcon: {
        opacity: 0.5,
        '&:hover': { opacity: 0.5 },
    },
    tooltip: {
        maxWidth: 'none',
    },
    preLine: {
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    contact: {
        paddingBottom: spacing(0.5),
    },
    requests: {
        paddingTop: spacing(),
    },
    empty: {
        lineHeight: '14px',
    },
});

export default SaleCardStyles;
