// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField, { type BaseTextFieldProps } from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import styles from './CRMInputStyles';

const CRMPasswordInput = ({ classes, error, onChange, ...rest }: BaseTextFieldProps) => {
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });

    const handleChange = event => {
        setValues({ ...values, password: event.target.value });
        onChange(event);
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handlerCopy = event => event.preventDefault();

    return (
        <TextField
            {...rest}
            variant='outlined'
            error={!!error}
            helperText={error}
            InputProps={{
                classes: {
                    root: classes.cssOutlinedInput,
                    notchedOutline: classes.notchedOutline,
                    focused: classes.cssFocused,
                    disabled: classes.disabled,
                    error: classes.error,
                    input: classes.inputField,
                    adornedEnd: classes.adornedEnd,
                },
                endAdornment: (
                    <InputAdornment
                        position='end'
                        classes={{ root: classes.adornmentRoot }}
                    >
                        <IconButton
                            onClick={handleClickShowPassword}
                            disableRipple
                            classes={{ root: classes.iconButton }}
                        >
                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            FormHelperTextProps={{
                classes: { root: classes.text },
            }}
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            onCopy={handlerCopy}
        />
    );
};

export default withStyles(styles)(CRMPasswordInput);
