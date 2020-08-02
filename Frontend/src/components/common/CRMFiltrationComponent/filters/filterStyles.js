// @flow

const filterStyles = ({
    spacing,
    typography: {
        fontSize,
    },
}: Object) => ({
    inputFilterRoot: {
        minWidth: spacing(31),
        padding: spacing(1),
    },
    inputControls: {
        marginLeft: spacing(0.5),
    },
    inputField: {
        width: spacing(27),
    },
    icon: {
        cursor: 'pointer',
        margin: spacing(0, 0.5),
    },
    checkboxContainer: {
        minWidth: spacing(27.5),
        padding: spacing(2),
    },
    checkboxFilterRoot: {
        '& :first-child': {
            padding: 0,
        },
    },
    checkboxLabel: {
        fontSize,
        marginLeft: spacing(2),
    },
    checkboxLabelRoot: {
        margin: spacing(0, 0, 2, 0),
    },
    applyButton: {
        marginTop: spacing(2),
    },
    inputCalenderFilter: {
        minWidth: spacing(31),
        padding: spacing(1),
    },
});

export default filterStyles;
