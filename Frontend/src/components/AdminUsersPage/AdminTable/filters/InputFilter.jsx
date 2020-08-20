// @flow

import React, { Component } from 'react';
import {
    FormControl,
    FormGroup,
    TextField,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import styles from './CheckboxFilterStyles';

type Props = {
    columnKey: string | null | void,
    classes: Object,
    onSetFilters: (filterName: string | null | void, filterValue: number | Array<string> | string) => void;
    onClose: () => void;
    style?: Object
};

type State = {
    value: string,
};

class InputFilter extends Component<Props, State> {
    state = {
        value: '',
    };

    handleChange = ({ target: { value } }) => {
        this.setState({ value });
    };

    handleApplyFilters = ({ which }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const { onSetFilters, columnKey, onClose } = this.props;
        const { value } = this.state;

        if (which === 13) {
            onSetFilters(
                columnKey,
                value,
            );
            onClose();
        }
    };

    handleClickSend = () => {
        const { onSetFilters, columnKey, onClose } = this.props;
        const { value } = this.state;

        onSetFilters(
            columnKey,
            value,
        );
        onClose();
    };

    render() {
        const { value } = this.state;
        const { classes, style } = this.props;

        return (
            <FormControl>
                <FormGroup>
                    <TextField
                        onChange={this.handleChange}
                        value={value}
                        onKeyPress={this.handleApplyFilters}
                        InputProps={{
                            endAdornment: <Send
                                className={classes.sendIcon}
                                onClick={this.handleClickSend}
                            />,
                        }}
                        style={{ ...style }}
                    />
                </FormGroup>
            </FormControl>
        );
    }
}

export default withStyles(styles)(InputFilter);
