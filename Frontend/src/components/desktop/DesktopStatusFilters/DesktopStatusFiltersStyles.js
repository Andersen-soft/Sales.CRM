// @flow

import { statusColors, FONT_COLOR, STATUS_FILTER_BACKGROUND, STATUS_BORDER_COLOR } from 'crm-constants/jss/colors';

const { PRELEAD, LEAD, IN_WORK, OPPORTUNITY, CONTRACT } = statusColors;

const DesktopStatusFiltersStyles = ({ spacing, typography: { body2: { fontSize } } }: Object) => ({
    container: {
        marginBottom: spacing(),
    },
    filterButton: {
        height: spacing(5.5),
        marginTop: spacing(),
        marginBottom: spacing(),
        display: 'block',
        borderLeftStyle: 'solid',
        borderLeftWidth: '3px',
        paddingRight: spacing(2),
        paddingLeft: spacing(2),
        color: FONT_COLOR,
        fontSize,
        fontWeight: 'normal',
        textTransform: 'unset',
        '&:hover': {
            backgroundColor: STATUS_FILTER_BACKGROUND,
        },
    },
    all: {
        borderLeft: 'unset',
    },
    preLead: {
        borderColor: PRELEAD,
    },
    lead: {
        borderColor: LEAD,
    },
    inWork: {
        borderColor: IN_WORK,
    },
    opportunity: {
        borderColor: OPPORTUNITY,
    },
    contract: {
        borderColor: CONTRACT,
    },
    active: {
        backgroundColor: STATUS_FILTER_BACKGROUND,
    },
    archive: {
        borderLeft: 'unset',
    },
    overdue: {
        borderLeft: 'none',
    },
    overdueCounter: {
        padding: spacing(0.25, 1),
        borderRadius: spacing(0.5),
        backgroundColor: STATUS_BORDER_COLOR,
        position: 'relative',
        left: spacing(),
    },
});

export default DesktopStatusFiltersStyles;
