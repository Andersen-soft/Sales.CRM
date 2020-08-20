// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RootRef, Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {
    setUsersAction, setFiltersAction, resetAdminUsersStoreAction, getSalesUsersAction,
}
    from 'crm-actions/adminUsersActions/adminUsersActions';
import { resetAdminActivitiesStoreAction } from 'crm-actions/adminActivitiesActions/adminActivitiesActions';
import { requestDataForFiltersActions } from 'crm-api/adminUsersService';
import AdminTable from 'crm-components/AdminUsersPage/AdminTable/';
import AddUserModal from './AddUserModal';
import styles from './styles';
import type { Employee } from '../../constants/estimationRequestPage/estimationRequestPageConstants';
import type { ISaleProps } from '../../types/adminUsers';

type Props = {
    users: {
        number?: number,
        totalElements?: number
    },
    isLoading: boolean,
    setUsers: (page: ?number) => void,
    sales: Array<Employee>,
    classes: Object,
    filters: Object,
    setFilters: () => void,
    resetAdminUsersStore: () => void,
    history: Object,
    resetAdminActivitiesStore: () => void,
} & ISaleProps;

type State = {
    openModal: boolean
}

class AdminUsersPage extends PureComponent<Props, State> {
    state = {
        openModal: false,
    };

    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }

    componentDidMount() {
        document.title = 'Users CRM  ';
        this.props.resetAdminActivitiesStore();
    }

    handleToggleModal = () => {
        this.setState(prevState => ({
            openModal: !prevState.openModal,
        }));
    }

    handlePageChange = (event: SyntheticInputEvent<HTMLInputElement>, page: ?number) => {
        this.props.setUsers(page);
        this.scrollToTable();
    };

    scrollToTable = () => {
        const { current } = this.tableRef;
        const table = current.children[1];

        current && table.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    userPageRender() {
        const {
            classes,
            users,
            setUsers,
            isLoading,
            filters,
            setFilters,
            resetAdminUsersStore,
            history,
            fetchSales,
            sales,
            isSalesLoading,
        } = this.props;
        const { number, totalElements } = users;
        const { openModal } = this.state;


        return (
            <React.Fragment>
                <Grid className={classes.wrapper}>
                    <Grid
                        container
                        className={classes.container}
                    >
                        <Button
                            onClick={this.handleToggleModal}
                            className={classes.button} color='primary'
                            variant='outlined'
                        >
                        Добавить пользователя
                        </Button>
                    </Grid>
                    <Grid
                        container
                        className={classes.content}
                    >
                        <AdminTable
                            currentPage={number}
                            totalElements={totalElements}
                            users={users}
                            history={history}
                            setUsers={setUsers}
                            resetAdminUsersStore={resetAdminUsersStore}
                            onHandlePageChange={this.handlePageChange}
                            loading={isLoading}
                            scrollToTable={() => this.scrollToTable.call(this)}
                            requestDataForFilters={requestDataForFiltersActions}
                            filters={filters}
                            onSetFilters={setFilters}
                            fetchSales={fetchSales}
                            sales={sales}
                            isSalesLoading={isSalesLoading}
                        />
                        <AddUserModal
                            onSetFilters={setFilters} open={openModal}
                            setUsers={setUsers}
                            onToggleModal={this.handleToggleModal}
                            fetchSales={fetchSales}
                            sales={sales}
                            isSalesLoading={isSalesLoading}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }

    tableRef: { current: any }

    render() {
        return (
            <RootRef rootRef={this.tableRef}>
                {this.userPageRender()}
            </RootRef>
        );
    }
}

const mapStateToProps = state => ({
    users: state.AdminUsers.users,
    isLoading: state.AdminUsers.isLoading,
    filters: state.AdminUsers.filters,
    sales: state.AdminUsers.sales,
    isSalesLoading: state.AdminUsers.isSalesLoading,
});

const mapDispatchToProps = {
    setUsers: setUsersAction,
    setFilters: setFiltersAction,
    fetchSales: getSalesUsersAction,
    resetAdminUsersStore: resetAdminUsersStoreAction,
    resetAdminActivitiesStore: resetAdminActivitiesStoreAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminUsersPage));
