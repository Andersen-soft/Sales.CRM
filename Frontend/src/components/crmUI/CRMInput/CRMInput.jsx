// @flow

import React from 'react';
import { omit, isNil } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';

import {
    Typography,
    TextField,
    InputAdornment,
    Tooltip,
    LinearProgress,
    Fade,
    IconButton,
} from '@material-ui/core';

import { type BaseTextFieldProps } from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import styles from './CRMInputStyles';

export type CRMInputProps = BaseTextFieldProps;

const CRMInput = ({
    classes,
    error,
    showErrorMessage,
    clearable,
    searchable,
    onClear,
    InputProps = { classes: {} },
    value,
    inputValue,
    readOnly,
    isLoading,
    LoadingProps,
    InputLabelProps,
    ...rest
}: CRMInputProps) => {
    const { classes: inputClasses } = InputProps;
    const dateValue = !isNil(value) ? value : inputValue;
    const inputProps = {
        classes: {
            ...InputProps.classes,
            root: cn(classes.cssOutlinedInput, inputClasses.root),
            notchedOutline: cn(
                classes.notchedOutline,
                inputClasses.notchedOutline,
            ),
            focused: cn(classes.cssFocused, inputClasses.cssFocused),
            disabled: cn(classes.disabled, inputClasses.disabled),
            error: cn(classes.error, inputClasses.error),
            input: cn(classes.inputField, inputClasses.input),
        },
        readOnly,
        ...(clearable || searchable || error
            ? {
                endAdornment: (
                    <InputAdornment position='end'>
                        {(error && !showErrorMessage) && (
                            <>
                                <Tooltip
                                    title={error}
                                    classes={{
                                        tooltip: classes.errorPopper,
                                    }}
                                    placement='top-start'
                                    PopperProps={{
                                        modifiers: {
                                            offset: { offset: '5px, -85px' },
                                        },
                                    }}
                                >
                                    <IconButton
                                        className={(rest.multiline && rest.rows > 1)
                                            ? cn(classes.iconButton, classes.errorIcon, classes.errorIconMultiline)
                                            : cn(classes.iconButton, classes.errorIcon)
                                        }
                                    >
                                        <ErrorOutline />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {clearable || (searchable && dateValue) ? (
                            <IconButton
                                className={classes.iconButton}
                                onClick={onClear}
                            >
                                <ClearIcon />
                            </IconButton>
                        ) : (
                            searchable && (
                                <SearchIcon
                                    className={cn(
                                        classes.iconButton,
                                        classes.icon,
                                    )}
                                />
                            )
                        )}
                    </InputAdornment>
                ),
                ...omit(['classes'], InputProps),
            }
            : { ...omit(['classes'], InputProps) }),
    };

    return (
        <>
            <TextField
                {...rest}
                value={dateValue}
                variant='outlined'
                error={!!error}
                InputProps={{ ...inputProps }}
                FormHelperTextProps={{
                    classes: { root: classes.text },
                }}
                InputLabelProps={{
                    classes: {
                        root: classes.inputLabel,
                        error: classes.error,
                    },
                    ...InputLabelProps,
                }}
            />
            {(error && showErrorMessage) && (
                <Typography className={classes.errorMessage}>{error}</Typography>
            )}
            <Fade
                in={isLoading}
                unmountOnExit
            >
                <LinearProgress
                    value={100}
                    valueBuffer={5}
                    classes={{
                        root: classes.loader,
                    }}
                    {...LoadingProps}
                />
            </Fade>
        </>
    );
};

export default withStyles(styles)(CRMInput);
