// @flow

const SelectCompanyModalStyles = ({
    spacing,
    typography: {
        h6: { fontSize: fontSizeH6 },
    },
}: Object) => ({
    rounded: {
        borderRadius: `${spacing()} !important`,
        width: spacing(73),
        padding: spacing(3),
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    modalTitle: {
        fontSize: fontSizeH6,
        padding: 0,
        marginBottom: spacing(4),
    },
    title: {
        width: spacing(62),
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
    buttonContainer: {
        marginRight: spacing(2),
    },
});

export default SelectCompanyModalStyles;
