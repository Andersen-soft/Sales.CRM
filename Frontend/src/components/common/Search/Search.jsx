// @flow

import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, TextField } from '@material-ui/core';

import { Close, Search } from '@material-ui/icons';

import styles from './SearchStyles';

type Props = {
    classes: Object,
    handleSearch: (event: SyntheticInputEvent<HTMLInputElement>) => void,
    handleOnEnter: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
    cancelSearch: () => void,
    searchValue: string,
}

class Searchinput extends PureComponent<Props> {
    render() {
        const { classes, cancelSearch, handleSearch, handleOnEnter, searchValue } = this.props;

        return (
            <Grid
                container
                justify='flex-start'
                className={classes.top}
            >
                <TextField
                    className={classes.searchField}
                    variant='outlined'
                    InputProps={{
                        endAdornment: searchValue.length
                            ? <Close
                                className={classes.clearButton}
                                onClick={cancelSearch}
                            />
                            : <Search />,
                    }}
                    value={searchValue}
                    onChange={handleSearch}
                    onKeyUp={handleOnEnter}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(Searchinput);
