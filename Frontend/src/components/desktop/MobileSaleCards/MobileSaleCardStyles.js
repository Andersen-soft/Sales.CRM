// @flow
import { FONT_COLOR, HEADER_CELL, LIGHTGRAY, LINK_COLOR, statusColors } from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';
import { ALL_BACKGROUND } from 'crm-constants/desktop/colors';

const MobileSaleCardStyles = ({ spacing, typography: { fontSize, fontWeightLight, fontWeightRegular } }: Object) => ({
    root: {
        position: 'relative',
        padding: spacing(2),
        boxShadow: `0 0 15px ${LIGHTGRAY}`,
        borderRadius: spacing(0.5),
        marginBottom: spacing(),
        borderLeft: '4px solid',
        maxWidth: '100%',
    },
    smallSubHeader: {
        color: HEADER_CELL,
        fontSize: FONT_SIZE_SMALL,
        marginTop: spacing(0.5),
    },
    lightFont: {
        fontWeight: fontWeightLight,
    },
    topSubColumn: {
        marginBottom: spacing(1.5),
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: spacing(16.25),
        width: spacing(0.5),
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    nextActivity: {
        width: 'fit-content',
        fontSize,
    },
    saleLink: {
        fontWeight: fontWeightRegular,
        color: FONT_COLOR,
        '&:hover': { color: LINK_COLOR },
    },
    preLead: {
        borderColor: statusColors.PRELEAD,
    },
    lead: {
        borderColor: statusColors.LEAD,
    },
    all: {
        borderColor: ALL_BACKGROUND,
    },
    inWork: {
        borderColor: statusColors.IN_WORK,
    },
    opportunity: {
        borderColor: statusColors.OPPORTUNITY,
    },
    contract: {
        borderColor: statusColors.CONTRACT,
    },
    dotsMenu: {
        position: 'absolute',
        top: spacing(-0.5),
        right: spacing(-1),
    },
    infoText: {
        color: FONT_COLOR,
        fontSize: 12,
        fontWeight: fontWeightLight,
    },
    socialIcon: {
        marginRight: spacing(),
    },
    disableIcon: {
        opacity: 0.5,
        '&:hover': { opacity: 0.5 },
    },
    row: {
        marginBottom: spacing(2),
    },
    icon: {
        marginRight: spacing(),
        opacity: 1,
    },
    tooltip: {
        maxWidth: 'none',
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
    emptyBlockWidth: {
        width: spacing(20),
    },
});

export default MobileSaleCardStyles;
