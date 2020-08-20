// @flow

import { LIGHTGRAY, WHITE } from 'crm-constants/jss/colors';

const SalePageStyle = ({
    spacing,
    typography: {
        fontWeightMedium,
    },
}: Object) => ({
    scroll: {
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
    },
    container: {
        padding: spacing(),
    },
    topContainer: {
        padding: spacing(1, 0),
    },
    activitiesHistory: {
        padding: spacing(1, 0),
    },
    saleCard: {
        paddingRight: spacing(2),
    },
    companyCard: {
        paddingBottom: spacing(2),
    },
    dialogConfirmationTitle: {
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: spacing(2),
        padding: spacing(5, 7),
    },
    dialogConfirmationButton: {
        marginBottom: spacing(5),
    },
    // backdrop-filter не поддерживается в Firefox (добавлено @supports)
    dialogConfirmation: {
        '& div.MuiBackdrop-root': {
            backgroundColor: `${WHITE}CC`,
        },
        '& .MuiPaper-root': {
            borderRadius: spacing(1),
        },
    },
    '@supports (backdrop-filter: blur(5px))': {
        dialogConfirmation: {
            '& div.MuiBackdrop-root': {
                backdropFilter: 'blur(5px)',
                backgroundColor: `${WHITE}80`,
            },
            '& .MuiPaper-root': {
                boxShadow: `0 0 15px ${LIGHTGRAY}`,
            },
        },
    },
    bold: {
        fontWeight: fontWeightMedium,
    },
});

export default SalePageStyle;
