// @flow

import React, { PureComponent } from 'react';

import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
} from '@material-ui/icons';

import {
    Grid,
    IconButton,
    Input,
} from '@material-ui/core';

import { max } from 'ramda';

import {
    INNER_FIST_PAGE,
    USER_FIRST_PAGE,
    KEY_CODE,
} from 'crm-constants/common/pagination/paginationConstants';

import {
    toInnerNumiration,
    toUserNumiration,
    totalElementsCheck,
    nextPageCheck,
} from 'crm-utils/dataTransformers/pagination';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './PaginationActionsStyles';

type EventParams = {
    charCode: number,
    target: HTMLElement,
    preventDefault: Function,
}

type Props = {
    classes: Object,
    count: number,
    rowsPerPage: number,
    page: number,
    onChangePage: (event: SyntheticEvent<EventTarget>, page: number) => void,
}

type State = {
    userPage: string | null,
    error: boolean,
    count: number | null,
    isEditable: boolean,
}

class PaginationActions extends PureComponent<Props, State> {
    state = {
        userPage: null,
        error: false,
        count: null,
        isEditable: false,
    };

    getUserLastPage = () => {
        const { count, rowsPerPage } = this.props;

        return Math.ceil(count / rowsPerPage);
    };

    static getDerivedStateFromProps(
        { count: nextCount, page: nextPage }: Props,
        { count: prevCount, userPage, isEditable }: State,
    ) {
        if (totalElementsCheck(userPage, prevCount, nextCount)) {
            return {
                userPage: String(toUserNumiration(nextPage)),
                count: nextCount,
                error: false,
            };
        }

        if (nextPageCheck(nextPage, userPage, isEditable)) {
            return {
                userPage: String(toUserNumiration(nextPage)),
                error: false,
            };
        }

        return null;
    }

    handleFirstPageButtonClick = (event: SyntheticEvent<EventTarget>) => {
        const { onChangePage } = this.props;

        onChangePage(event, INNER_FIST_PAGE);
        this.setState({
            userPage: String(USER_FIRST_PAGE),
            error: false,
        });
    };

    handleBackButtonClick = (event: SyntheticEvent<EventTarget>) => {
        const { onChangePage, page } = this.props;
        const prevPage = page - 1;

        onChangePage(event, prevPage);
        this.setState({
            userPage: String(toUserNumiration(prevPage)),
            error: false,
            isEditable: true,
        });
    };

    handleNextButtonClick = (event: SyntheticEvent<EventTarget>) => {
        const { onChangePage, page } = this.props;
        const nextPage = page + 1;

        onChangePage(event, nextPage);
        this.setState({
            userPage: String(toUserNumiration(nextPage)),
            error: false,
            isEditable: true,
        });
    };

    handleLastPageButtonClick = (event: SyntheticEvent<EventTarget>) => {
        const { onChangePage } = this.props;
        const innerLastPage = toInnerNumiration(this.getUserLastPage());

        onChangePage(event, max(INNER_FIST_PAGE, innerLastPage));
        this.setState({
            userPage: String(max(USER_FIRST_PAGE, this.getUserLastPage())),
            error: false,
        });
    };

    handleKeyPress = ({ charCode, target, preventDefault }: EventParams) => {
        if (charCode >= KEY_CODE.ZERO && charCode <= KEY_CODE.NINE) {
            return;
        }
        if (charCode === KEY_CODE.BACKSPACE || charCode === KEY_CODE.DELETE) {
            return;
        }
        if (charCode === KEY_CODE.ENTER) {
            target.blur();
            return;
        }

        preventDefault();
    };

    handlePaste = (event: SyntheticEvent<EventTarget>) => event.preventDefault();

    handleChangeValue = ({ target: { value: strValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        const value = Number(strValue);

        if (value === 0 || value > this.getUserLastPage()) {
            this.setState({
                userPage: value === 0 ? '' : strValue,
                error: true,
                isEditable: true,
            });

            return;
        }

        this.setState({
            userPage: strValue,
            error: false,
            isEditable: true,
        });
    };

    handleBlur = () => this.setState({ isEditable: false });

    sendCurrentPage = (event: SyntheticEvent<EventTarget>) => {
        const { onChangePage } = this.props;
        const { userPage, error } = this.state;

        if (error) {
            return;
        }

        onChangePage(
            event,
            toInnerNumiration(Number(userPage)),
        );

        this.setState({ isEditable: false });
    };

    render() {
        const userLastPage = this.getUserLastPage();
        const {
            props: {
                classes,
            },
            state: {
                userPage,
                error,
            },
            sendCurrentPage: handleSendCurrentPage,
        } = this;
        const isNextPage = !userPage || userLastPage <= Number(userPage);
        const isPrev = !userPage || USER_FIRST_PAGE === Number(userPage);

        return (
            <Grid className={classes.paginationWrapper}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={isPrev}
                    classes={{ root: classes.arrow }}
                >
                    <FirstPage />
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    onBlur={this.handleBlur}
                    disabled={isPrev}
                    classes={{ root: classes.arrow }}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <Grid className={classNames(classes.gotoWrapper, classes.gotoLabel)}>
                    <Input
                        value={userPage}
                        error={error}
                        onKeyPress={this.handleKeyPress}
                        onBlur={handleSendCurrentPage}
                        onChange={this.handleChangeValue}
                        onPaste={this.handlePaste}
                        classes={{ root: classes.gotoInput }}
                    />
                    of&nbsp;
                    {userLastPage}
                </Grid>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    onBlur={this.handleBlur}
                    disabled={isNextPage}
                    classes={{ root: classes.arrow }}
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={isNextPage}
                    classes={{ root: classes.arrow }}
                >
                    <LastPage />
                </IconButton>
            </Grid>
        );
    }
}

export default withStyles(styles)(PaginationActions);
