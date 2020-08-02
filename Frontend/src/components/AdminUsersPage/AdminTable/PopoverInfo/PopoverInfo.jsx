// @flow

import React, { Component } from 'react';

import { InfoOutlined } from '@material-ui/icons';

import { Popover, Grid, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

type Props = {
    classes: Object,
    description: string,
};

type State = {
    anchorEl: ?HTMLElement,
};

class PopoverInfo extends Component<Props, State> {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    render() {
        const { classes, description } = this.props;

        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <>
                <InfoOutlined
                    onClick={this.handleClick}
                    fontSize='small'
                    className={classes.infoIcon}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Grid className={classes.popoverContentWrapper}>
                        <Grid container>
                            {description
                                ? <Typography>{description}</Typography>
                                : <Typography className={classes.empty}>Отсутствует</Typography>}
                        </Grid>
                    </Grid>
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(PopoverInfo);
