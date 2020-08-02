// @flow

import React, { Component } from 'react';
import { isEmpty, isNil } from 'ramda';
import {
    RootRef,
    Grid,
    Fade,
    Popover,
} from '@material-ui/core';
import { FilterList, Close } from '@material-ui/icons';

import { withStyles } from '@material-ui/core/styles';
import styles from 'crm-components/common/CRMFiltrationComponent/FiltrationComponentStyles';

export const SUGGESTION_POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
};

export const SUGGESTIONS_WIDTH: number = 350;

type Props = {
    component: typeof Component,
    onSetFilters: (filterName: string, filterValue: number | Array<string> | string | null) => void;
    onFilteredRequests: Function,
    requestDataForFilters: Function,
    columnKey: string,
    classes: Object,
    filters: {
        status: Array<string> | null,
        companyId: number | null,
        creatorId: number | null,
        responsibleId: number | null,
        name: string | null,
    },
};

type State = {
    anchor: HTMLElement | null,
    columnKey: string | null,
    suggestionAlign: string,
};

type RefArgument = {
    current: HTMLElement,
}

const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
};

class Filtration extends Component<Props, State> {
    state = {
        anchor: null,
        columnKey: null,
        suggestionAlign: SUGGESTION_POSITION.LEFT,
    };

    constructor(props: Props) {
        super(props);
        this.suggestionsRef = React.createRef();
    }

    getBlockPaddingByPage = ({ current }: RefArgument) => {
        const leftEdgePosition = current.getBoundingClientRect();

        return { left: leftEdgePosition.left };
    };

    handleOpenFiltration = async (event: SyntheticEvent<HTMLElement>) => {
        const { currentTarget } = event;
        const { columnKey } = this.props;

        this.setState({ anchor: currentTarget, columnKey });
        this.setSuggestionPosition();
    };

    handleDestroyFiltration = () => {
        this.setState({ anchor: null });
    };

    handleClearFilters = () => {
        const { onSetFilters, columnKey } = this.props;

        onSetFilters(columnKey, null);
    };

    isFiltered = () => {
        const { filters, columnKey } = this.props;

        return !(isEmpty(filters[columnKey]) || isNil(filters[columnKey]));
    };

    setSuggestionPosition = () => {
        if (!this.suggestionsRef) {
            return;
        }

        const { left } = this.getBlockPaddingByPage(this.suggestionsRef);

        if (left < SUGGESTIONS_WIDTH) {
            this.setState({ suggestionAlign: SUGGESTION_POSITION.LEFT });
        } else {
            this.setState({ suggestionAlign: SUGGESTION_POSITION.RIGHT });
        }
    };

    updateComponent = () => {
        const { anchor } = this.state;

        this.setState({ anchor: null }, () => this.setState({ anchor }));
    };

    suggestionsRef: {current: Object};

    render() {
        const {
            component: FilterComponent,
            classes,
            onFilteredRequests,
            requestDataForFilters,
            onSetFilters,
            filters,
        } = this.props;
        const {
            anchor,
            columnKey,
            suggestionAlign,
        } = this.state;
        const isOpen = Boolean(anchor);

        return (
            <RootRef rootRef={this.suggestionsRef}>
                <Grid className={classes.wrapper}>
                    <Grid className={classes.iconsWrapper}>
                        <FilterList
                            onClick={this.handleOpenFiltration}
                            className={classes.icon}
                        />
                        {this.isFiltered()
                        && <Close
                            onClick={this.handleClearFilters}
                            className={classes.closeIcon}
                        />}
                    </Grid>
                    <Popover
                        open={isOpen}
                        TransitionComponent={Fade}
                        classes={{ paper: classes.input }}
                        className={classes.paper}
                        anchorEl={anchor}
                        anchorOrigin={anchorOrigin}
                        onClose={this.handleDestroyFiltration}
                    >
                        <FilterComponent
                            onSetFilters={onSetFilters}
                            columnKey={columnKey}
                            filters={filters}
                            onClose={this.handleDestroyFiltration}
                            onFilteredRequests={onFilteredRequests}
                            requestDataForFilters={requestDataForFilters}
                            suggestionAlign={suggestionAlign}
                            updateComponent={this.updateComponent}
                        />
                    </Popover>
                </Grid>
            </RootRef>
        );
    }
}

export default withStyles(styles)(Filtration);
