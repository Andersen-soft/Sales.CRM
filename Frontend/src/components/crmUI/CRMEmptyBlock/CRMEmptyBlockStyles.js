// @flow

import { HEADER_CELL } from 'crm-constants/jss/colors';

export default ({ spacing, typography: { caption: { fontSize }, fontWeightLight } }: Object) => ({
    emptyBlock: {
        color: HEADER_CELL,
        fontSize,
        fontWeight: fontWeightLight,
        lineHeight: spacing(0.25),
    },
});
