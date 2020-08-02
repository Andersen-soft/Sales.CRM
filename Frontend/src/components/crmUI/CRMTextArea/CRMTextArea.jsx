// @flow

import React from 'react';
import cn from 'classnames';
import { path, propOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { type BaseTextFieldProps } from '@material-ui/core/TextField';
import CRMInput from 'crm-ui/CRMInput/CRMInput';

import styles from './CRMTextAreaStyles';

const CRMTextArea = ({
    className,
    classes,
    InputProps = {},
    InputLabelProps = {},
    ...props
}: BaseTextFieldProps) => (
    <CRMInput
        className={cn(className, classes.textArea)}
        InputProps={{
            ...InputProps,
            classes: {
                ...propOr({}, 'classes', InputProps),
                root: cn(classes.inputElementRoot, path(['classes', 'root'], InputProps)),
                focused: cn(classes.focused, path(['classes', 'focused'], InputProps)),
                notchedOutline: cn(classes.inputElementFocused, path(['classes', 'notchedOutline'], InputProps)),
                input: cn(classes.input, path(['classes', 'input'], InputProps)),
            },
        }}
        InputLabelProps={{
            ...InputLabelProps,
            classes: {
                root: cn(classes.label, path(['classes', 'root'], InputProps)),
            },
        }}
        {...props}
    />);

export const defaultProps = {
    margin: 'none',
    variant: 'outlined',
    multiline: true,
    fullWidth: true,
    rowsMax: 3,
    autoFocus: false,
};

CRMTextArea.defaultProps = defaultProps;

export default withStyles(styles)(CRMTextArea);

