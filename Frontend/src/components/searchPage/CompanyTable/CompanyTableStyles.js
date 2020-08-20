// @flow

import { HEADER_CELL } from 'crm-constants/jss/colors';

export default ({
    spacing,
    typography: {
        fontWeightRegular: fontWeight,
        fontSize,
    },
}: Object) => ({
    tableRoot: {
        overflow: 'unset',
    },
    cell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    head: {
        height: spacing(5),
    },
    headerCell: {
        '& >div': {
            flexWrap: 'nowrap',
            height: spacing(3),
        },
    },
    title: {
        fontWeight,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
        whiteSpace: 'pre',
    },
    name: {
        minWidth: spacing(27),
        wordBreak: 'unset',
        whiteSpace: 'unset',
    },
    url: {
        minWidth: spacing(22),
    },
    phone: {
        minWidth: spacing(17),
    },
    description: {
        width: spacing(53),
        maxWidth: spacing(53),
    },
    industry: {
        width: spacing(30),
        maxWidth: spacing(30),
    },
    deliveryDirector: {
        minWidth: spacing(22),
    },
    linkedSales: {
        minWidth: spacing(19),
    },
});
