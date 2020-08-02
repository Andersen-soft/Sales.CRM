// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MaterialInput from '@material-ui/core/Input';

import type { InputProps } from '@material-ui/core/Input';
import ClearButton from 'crm-components/common/Input/ClearButton';


type Props = InputProps & {
    error?: string;
    fullWidth?: boolean;
    isDisable?: boolean;
    name?: string;
    id?: string;
    label: string;
    required?: boolean;
    clearable?: boolean
}

export default function Input({
    name, onChange, isDisable, error, fullWidth, clearable = false, ...props
}: Props) {
    const materialInputProps = {
        ...props,
        name,
        onChange,
        ...(clearable ? {
            endAdornment: (<ClearButton name={name} onChange={onChange} />),
        } : {}),
    };

    return (
        <FormControl error={!!error} fullWidth={fullWidth}>
            <InputLabel
                htmlFor={props.name || props.id}
                required={props.required}
                disabled={isDisable}
            >
                {props.label}
            </InputLabel>

            <MaterialInput {...materialInputProps} disabled={isDisable} />
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    );
}
