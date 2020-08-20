// @flow
import React, { PureComponent } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';


export type ClearButtonProps = {
    name: string,
    onChange: ({ target: { value: string } }) => void,
};


export default class ClearButton extends PureComponent<ClearButtonProps> {
    handleClick = ({ target, ...event }: SyntheticMouseEvent<HTMLInputElement>) => {
        const { name, onChange } = this.props;

        return onChange({
            ...event,
            target: {
                ...target,
                name,
                value: '',
            },
        });
    };

    render() {
        return (
            <InputAdornment position='end'>
                <IconButton onClick={this.handleClick}>
                    <ClearIcon />
                </IconButton>
            </InputAdornment>
        );
    }
}
