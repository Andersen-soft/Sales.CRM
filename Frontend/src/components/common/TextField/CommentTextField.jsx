// @flow

import React, { memo } from 'react';

import {
    FormControl,
    TextField,
    FormHelperText,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

type Props ={
    fullWidth?: boolean;
    name: string;
    label?: string;
    value: string;
    menuItems: Array<string>;
    onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void;
    error?: string;
    classes: Object;
    rows?: number;
    rowsMax?: number;
    showError?: boolean;
}

type MemoProps ={
    onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void;
}

const styles = {
    fieldWrapper: {
        marginTop: 16,
    },
};

const CommentTextField = ({
    onChange, fullWidth, name, label, value, error, classes, rows, rowsMax, showError = true, ...rest
}: Props) => (
    <FormControl
        fullWidth={fullWidth}
        error={!!error}
        className={classes.fieldWrapper}
    >
        <TextField
            key={label}
            fullWidth
            multiline
            variant='outlined'
            label={label}
            value={value}
            onChange={onChange}
            name={name}
            rows={rows}
            rowsMax={rowsMax}
            error={!!error}
            {...rest}
        >
            {value}
        </TextField>
        {showError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
);

const StyledCommentTextField = withStyles(styles)(CommentTextField);

export default memo < MemoProps > (StyledCommentTextField);
