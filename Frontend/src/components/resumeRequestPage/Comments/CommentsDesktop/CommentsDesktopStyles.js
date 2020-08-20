// @flow

const CommentsDesktopStyles = ({ spacing }: Object) => ({
    paperRoot: {
        padding: 0,
        height: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    container: {
        minHeight: '100%',
        maxHeight: spacing(57.625),
    },
});

export default CommentsDesktopStyles;
