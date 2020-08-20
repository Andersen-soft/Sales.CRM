// @flow

import {
    HEADER_CELL,
    FONT_COLOR,
    LINK_COLOR,
    VISIBLE_ICON_COLOR,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';
import { statusesBackgrounds } from 'crm-constants/desktop/colors';

const CompanyInfoStyles = ({
    spacing,
    typography: {
        subtitle1: { lineHeight },
    },
}: Object) => ({
    companyInfo: {
        position: 'relative',
        paddingRight: spacing(2),
    },
    companyName: {
        fontWeight: 400,
        color: FONT_COLOR,
        display: 'inline',
    },
    companyNameEllipsis: {
        display: 'block',
        overflow: 'hidden',
        width: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    saleLink: {
        lineHeight,
        '&:hover': { color: LINK_COLOR },
    },
    saleText: {},
    statusBar: {
        position: 'absolute',
        left: spacing(-1),
        top: spacing(0.25),
        height: spacing(2.5),
        width: spacing(0.25),
        borderTopLeftRadius: 1,
        borderBottomLeftRadius: 1,
    },
    infoIcon: {
        marginLeft: spacing(),
        verticalAlign: 'middle',
        color: VISIBLE_ICON_COLOR,
        opacity: 1,
        cursor: 'pointer',
        width: spacing(2),
        height: spacing(2),
    },
    infoPopover: {
        maxWidth: spacing(43),
        padding: spacing(),
        borderRadius: spacing(),
        overflow: 'auto',
    },
    smallSubHeader: {
        color: HEADER_CELL,
        fontSize: FONT_SIZE_SMALL,
        marginTop: spacing(0.5),
    },
    lightFont: {
        fontWeight: 300,
    },
    smallSubText: {
        fontSize: FONT_SIZE_SMALL,
    },
    ...statusesBackgrounds,
});

export default CompanyInfoStyles;
