// @flow

import React, { PureComponent } from 'react';
import { TableCell, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';

import styles from '../styles';

type Props = {
    description: string,
    classes: Object,
}

type State = {
    isOpen: boolean,
}

export const showMoreDescriptionButton: string = '>>>';
export const showLessDescriptionButton: string = '<<<';

class Comment extends PureComponent<Props, State> {
    state = {
        isOpen: false,
    }

    handleShowFullDescription = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    }

    renderBigComment = () => {
        const { description, classes } = this.props;
        const { isOpen } = this.state;
        const smallDescription = description.slice(0, 90);

        return (<TableCell className={cn([classes.comment], { [classes.isOpen]: isOpen })} align='left'>
            {isOpen && <Typography>{description}</Typography>}
            {!isOpen && <Typography className={classes.smallDescription}>{smallDescription}</Typography>}
            {!isOpen && (<IconButton
                color='primary'
                className={classes.showMoreButtons}
                onClick={this.handleShowFullDescription}
            >
                {showMoreDescriptionButton}
            </IconButton>)}
            {isOpen && (<IconButton
                color='primary'
                className={classes.showMoreButtons}
                onClick={this.handleShowFullDescription}
            >
                {showLessDescriptionButton}
            </IconButton>)}
        </TableCell>);
    }

    renderDefaultComment = () => {
        const { description, classes } = this.props;

        return (
            <TableCell className={classes.comment} align='left'>
                {description}
            </TableCell>
        );
    }


    render() {
        const { description } = this.props;

        return (
            description.length > 90 ? this.renderBigComment() : this.renderDefaultComment()
        );
    }
}
export default withStyles(styles)(Comment);
