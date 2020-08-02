// @flow

import { BLOCK_BORDER } from 'crm-constants/jss/colors';

const DesktopCardsStyles = ({ spacing, typography: { body1: { fontSize } } }: Object) => ({
    card: {
        marginBottom: spacing(2),
        border: BLOCK_BORDER,
        borderRadius: spacing(),
    },
    pagination: {
        textAlign: 'center',
        boxShadow: 'unset',
        marginBottom: spacing(2),
        border: BLOCK_BORDER,
    },
    emptyCard: {
        textAlign: 'center',
        height: spacing(22),

    },
    emptyBlock: {
        fontSize,
    },
    mobileCardsContainer: {
        marginTop: spacing(2),
        paddingRight: spacing(),
        paddingLeft: spacing(),
    },
});

export default DesktopCardsStyles;

