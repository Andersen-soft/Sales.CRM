// @flow

import React from 'react';

import { TextField, FormHelperText } from '@material-ui/core';
import inputComponent from './InputComponent';

const Control = ({
    selectProps, innerRef, children, innerProps,
}: *) => (
    <>
        <TextField
            error={!!selectProps.error}
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: selectProps.classes.input,
                    inputRef: innerRef,
                    children,
                    ...innerProps,
                },
            }}
            {...selectProps.textFieldProps}
        />
        <FormHelperText className={selectProps.classes.errorMessage}>{selectProps.error}</FormHelperText>
    </>
);

export default Control;
