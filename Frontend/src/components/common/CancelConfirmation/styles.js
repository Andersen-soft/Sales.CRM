// @flow

const styles = ({
    spacing,
    mixins: { mobile },
    typography: {
        h6: { fontSize },
        body1: { lineHeight },
    },
}: Object) => ({
    textAlignCenter: {
        textAlign: 'center',
        padding: spacing(0, 4),
    },
    actions: {
        padding: spacing(4, 1, 5, 1),
    },
    buttonContainer: {
        marginRight: spacing(2),
        ...mobile({
            marginRight: spacing(),
            marginBottom: spacing(),
        }),
    },
    root: {
        margin: spacing(),
        borderRadius: spacing(),
        paddingTop: spacing(5.5),
    },
    text: {
        fontSize,
        lineHeight,
    },
});

export default styles;
