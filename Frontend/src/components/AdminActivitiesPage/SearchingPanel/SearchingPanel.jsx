// @flow

import React, { PureComponent } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Search from 'crm-components/common/Search';
import styles from './SearchingPanelStyles';

type Props = {
    classes: Object,
    onHandleSearch: () => void,
    onHandleOnPressKey: () => void,
    cancelSearch: () => void,
    searchValue: string,
};

class SearchingPanel extends PureComponent<Props> {
    render() {
        const {
            classes,
            onHandleSearch,
            onHandleOnPressKey,
            cancelSearch,
            searchValue,
        } = this.props;

        return (
            <Grid
                item
                className={classes.searchingPanelWrapper}
            >
                <Search
                    handleSearch={onHandleSearch}
                    handleOnEnter={onHandleOnPressKey}
                    cancelSearch={cancelSearch}
                    searchValue={searchValue}
                />
            </Grid>
        );
    }
}

export default withStyles(styles)(SearchingPanel);
