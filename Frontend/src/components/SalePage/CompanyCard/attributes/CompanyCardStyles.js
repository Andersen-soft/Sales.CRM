// @flow

import {
    FONT_COLOR,
    LINK_COLOR,
    UNDERLINE,
    BLOCK_BORDER,
    ACTION_LABEL,
} from 'crm-constants/jss/colors';

const CompanyCardStyles = ({
    spacing,
    typography: {
        fontWeightLight,
        fontWeightRegular,
        fontWeightMedium,
        h6: {
            fontSize: fontSizeH6,
        },
        body2: { fontSize: fontSize14 },
        caption: { fontSize },
        fontSize: FONT_SIZE_NORMAL,
    },
}: Object) => ({
    root: {
        borderRadius: spacing(),
        padding: spacing(3),
        border: BLOCK_BORDER,
    },
    commentContainer: {
        paddingTop: spacing(),
        paddingLeft: spacing(3),
    },
    fieldWrapper: {
        height: spacing(6),
    },
    icon: {
        marginLeft: spacing(0.5),
        marginRight: spacing(-3.75),
    },
    icon1C: {
        '& svg': {
            position: 'relative',
            bottom: 3,
            transform: 'scale(0.75)',
        },
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    menuButton: {
        position: 'relative',
        padding: 0,
    },
    menuWrapper: {
        maxHeight: spacing(4),
    },
    salesBlock: {
        marginTop: spacing(1.25),
        height: spacing(3),
    },
    fieldsContainer: {
        width: '40%',
    },
    acceptIcon: {
        marginRight: spacing(2),
    },
    ellipsisUrl: {
        display: 'block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: LINK_COLOR,
        fontWeight: fontWeightLight,
    },
    modalTitle: {
        fontSize: fontSizeH6,
        fontWeight: fontWeightRegular,
        lineHeight: spacing(0.4),
        padding: 0,
        marginTop: spacing(3),
        marginBottom: spacing(4),
    },
    buttonContainer: {
        marginRight: spacing(2),
    },
    formControl: {
        width: '100%',
    },
    phoneValue: {
        fontSize: fontSize14,
        fontWeight: fontWeightLight,
    },
    textAreaWrapper: {
        marginTop: spacing(1),
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
            fontSize: fontSize14,
        },
    },
    textAreaInput: {
        color: `${FONT_COLOR}!important`,
        fontSize,
        fontWeight: fontWeightLight,
    },
    links: {
        justifyContent: 'flex-end',
    },
    linkRight: {
        marginRight: 0,
        marginLeft: spacing(),
    },
    salesLinks: {
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
    },
    salesLinksBlock: {
        width: '100%',
    },
    paddingFix: {
        padding: 0,
    },
    wrapperTags: {
        padding: spacing(),
    },
    userInformation: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        cursor: 'pointer',
        fontSize: FONT_SIZE_NORMAL,
        height: spacing(2.5),
    },
    fullWidth: {
        width: '100%',
    },
    companyNameContainer: {
        height: spacing(4.5),
        width: '100%',
    },
    editCompany: {
        position: 'relative',
        top: spacing(-1),
        width: '100%',
    },
    containerDialog: {
        borderRadius: `${spacing()}px !important`,
        width: spacing(73),
        padding: spacing(3),
    },
    title: {
        width: spacing(55),
        textAlign: 'center',
    },
    selectContainer: {
        width: spacing(50),
        margin: '0 auto',
    },
    actions: {
        paddingBottom: 0,
        paddingTop: spacing(5),
    },
    industryInput: {
        width: '100%',
    },
    industryContainer: {
        paddingLeft: spacing(3),
        paddingTop: spacing(2.25),
    },
    label: {
        paddingTop: spacing(),
        marginRight: spacing(),
        color: ACTION_LABEL,
        fontSize: FONT_SIZE_NORMAL,
    },
    editable: {
        paddingTop: spacing(3.75),
    },
});

export default CompanyCardStyles;
