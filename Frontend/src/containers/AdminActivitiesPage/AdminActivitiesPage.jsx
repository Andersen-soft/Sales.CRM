// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { KeyboardBackspace } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import debounce from 'lodash.debounce';

import { getUser } from 'crm-api/adminActivitiesService';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import ActivitiesTable from 'crm-components/AdminActivitiesPage/ActivitiesTable/';
import {
    setDateRangeAction, setSearchAction, setUserIdAction, setPageAction,
    getActivitiesSearchAction,
}
    from 'crm-actions/adminActivitiesActions/adminActivitiesActions';
import { resetAdminUsersStoreAction } from 'crm-actions/adminUsersActions/adminUsersActions';
import { pages } from 'crm-constants/navigation';
import { getDefaultPage } from 'crm-helpers/navigation';
import Notification from 'crm-components/notification/NotificationSingleton';
import PeriodOfActivities from 'crm-components/AdminActivitiesPage/PeriodOfActivities/PeriodOfActivities';
import SearchingPanel from 'crm-components/AdminActivitiesPage/SearchingPanel/SearchingPanel';
import styles from './styles';

type Props = {
    userData: Object,
    activities: Object,
    usersId: number,
    routeParams: {
        usersId: number,
    },
    isLoading: boolean,
    history: Object,
    classes: Object,
    filters: Object,
    users: Object,
    getActivities: (usersId: number, page?: number) => void,
    resetAdminUsersStore: () => void,
    resetAdminActivitiesStore: () => void,
    setUserId: (usersId: number) => void,
    setPage: (page: number) => void,
    setDateRange: (newDateRange: Object) => void,
    setSearch: (value: string) => void,
    getActivitiesSearch: () => void,
}

type State = {
    search: string,
    userName: string
}
class AdminActivitiesPage extends PureComponent<Props, State> {
    state = {
        search: '',
        userName: '',
    }

    constructor(props) {
        super(props);
        const { userData, routeParams: { usersId }, history } = this.props;

        this.handleSearch = debounce(this.handleSearch, 500);

        if (Number.isNaN(+usersId)) {
            Notification.showMessage({
                message: `Внимание! Активность пользователя ${usersId} не существует.`,
                type: 'warning',
                closeTimeout: 15000,
            });
            history.push(getDefaultPage(userData ? userData.roles : []));
        }
    }

    async componentDidMount() {
        document.title = 'Активности пользователя';
        const { routeParams: { usersId }, setUserId, filters: { searchValue } } = this.props;

        setUserId(usersId);
        const user = await getUser(usersId);
        const userName = `${user.firstName} ${user.lastName}`;

        this.setState({ search: searchValue, userName });
    }

    componentWillUnmount() {
        const { history, resetAdminUsersStore } = this.props;

        history.location.pathname.indexOf('users/') !== -1 && resetAdminUsersStore();
    }

    handlePageChange = (event: SyntheticInputEvent<HTMLInputElement>, page: number) => {
        const { setPage } = this.props;

        setPage(page);
        this.scrollToTable();
    };


    handleFromDateChange = (type: string) => (date: Date) => {
        const { setDateRange, filters: { dateRange } } = this.props;
        const newDateRange = {
            ...dateRange,
            [type]: getDate(date, FULL_DATE_DS),
        };

        setDateRange(newDateRange);
    };


    handleSearch = (value: string) => {
        this.props.setSearch(value);
    };

    handleOnPressKey = ({ which }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const { search } = this.state;
        const searchSlice = search.replace(/\s+/g, ' ');

        this.props.setSearch(searchSlice);

        if (which === 13) {
            this.props.getActivitiesSearch();
        }
    };

    handleSearchChange = ({ target }: SyntheticInputEvent<HTMLInputElement>) => {
        const { value } = target;

        this.setState(() => ({ search: value }), () => {
            this.handleSearch(this.state.search);
        });
    }


    cancelSearch = async () => {
        await this.setState({ search: '' });
        this.props.setSearch(this.state.search);

        this.props.getActivitiesSearch();
    };

    scrollToTable = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    render() {
        const {
            classes, activities, isLoading, routeParams: { usersId },
            filters: { dateRange }, userData: { roles: userRoles },
        } = this.props;
        const { search, userName } = this.state;
        const { number, totalElements } = activities;

        return (
            <React.Fragment>
                <Grid
                    container
                    className={classes.container}
                >
                    <Link
                        to={pages.ADMIN_USERS}
                        className={classes.link}
                    >
                        <KeyboardBackspace className={classes.backLink} />
                    </Link>
                    <Typography
                        variant='h6' gutterBottom
                        className={classes.title}
                    >
                        Активности пользователя
                    </Typography>
                    <Typography
                        variant='h6' gutterBottom
                        className={classes.responsibleName}
                    >
                        {userName}
                    </Typography>
                </Grid>
                <Grid
                    container
                    className={classes.container}
                >
                    <PeriodOfActivities
                        dateRange={dateRange}
                        onHandleFromDateChange={this.handleFromDateChange}
                    />
                </Grid>
                <Grid
                    container
                    className={classes.container}
                >
                    <Typography
                        variant='h6' gutterBottom
                        className={classes.searchHint}
                    >
                        Search
                    </Typography>
                    <SearchingPanel
                        searchValue={search}
                        onHandleSearch={this.handleSearchChange}
                        onHandleOnPressKey={this.handleOnPressKey}
                        cancelSearch={this.cancelSearch}
                    />
                </Grid>
                <Grid container>
                    <ActivitiesTable
                        currentPage={number}
                        totalElements={totalElements}
                        activities={activities}
                        onHandlePageChange={this.handlePageChange}
                        responsibleId={usersId}
                        loading={isLoading}
                        userRoles={userRoles}
                    />
                </Grid>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    userData: state.session.userData,
    activities: state.AdminActivities.activities,
    filters: state.AdminActivities.filters,
    isLoading: state.AdminActivities.isLoading,
    users: state.AdminUsers.users,
});

const mapDispatchToProps = {
    setUserId: setUserIdAction,
    setPage: setPageAction,
    getActivitiesSearch: getActivitiesSearchAction,
    resetAdminUsersStore: resetAdminUsersStoreAction,
    setDateRange: setDateRangeAction,
    setSearch: setSearchAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminActivitiesPage));
