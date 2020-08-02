// @flow

import { statusColors, WHITE, HEADER_CELL, BACKGROUND } from 'crm-constants/jss/colors';

const { PRELEAD, LEAD, IN_WORK, OPPORTUNITY, CONTRACT } = statusColors;

const MobileFiltersStyles = ({ spacing, typography: { caption: { fontSize } } }: Object) => ({
    filterButton: {
        border: '1px solid #E5E9F0',
        width: '100%',
        height: spacing(4),
        paddingTop: 0,
        paddingBottom: 0,
        textTransform: 'unset',
        color: HEADER_CELL,
        fontSize,
    },
    active: {
        color: WHITE,
    },
    allActive: {
        backgroundColor: `${BACKGROUND} !important`,
    },
    preLeadActive: {
        backgroundColor: `${PRELEAD} !important`,
        color: WHITE,
    },
    leadActive: {
        backgroundColor: `${LEAD} !important`,
        color: WHITE,
    },
    inWorkActive: {
        backgroundColor: `${IN_WORK} !important`,
        color: WHITE,
    },
    opportunityActive: {
        backgroundColor: `${OPPORTUNITY} !important`,
        color: WHITE,
    },
    contractActive: {
        backgroundColor: `${CONTRACT} !important`,
        color: WHITE,
    },
    overdueActive: {
        backgroundColor: `${BACKGROUND} !important`,
    },
    archiveActive: {
        backgroundColor: `${BACKGROUND} !important`,
    },
    filterRow: {
        paddingBottom: spacing(),
    },
    actions: {
        marginTop: spacing(),
        marginBottom: spacing(2),
    },
    mobileFilters: {
        paddingRight: spacing(),
        paddingLeft: spacing(),
    },
});

export default MobileFiltersStyles;
