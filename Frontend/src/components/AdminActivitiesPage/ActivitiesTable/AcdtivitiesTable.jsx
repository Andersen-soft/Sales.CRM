// @flow

import React, { PureComponent } from 'react';
import {
    Paper,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableFooter,
    TableCell,
    TableBody,
    Typography,
    CircularProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { isEmpty } from 'ramda';

import { ADMIN } from 'crm-constants/roles';
import Notification from 'crm-components/notification/NotificationSingleton';
import { SALES_LINK } from 'crm-constants/adminActivities/adminActivities';
import { PAGE_SIZE, NO_DATA_FOUND_MESSAGE } from 'crm-constants/adminUsers/adminUsers';
import SelectablePagination from 'crm-components/common/pagination';
import getFormattedDate from 'crm-utils/dataTransformers/sales/getFormattedTableDate';
import Comment from './attributes/Comment';
import styles from './styles';


export const tableHeaderItems: Array<Object> = [
    {
        key: '1',
        title: 'Дата активности',
    },
    {
        key: '2',
        title: 'Тип активности',
    },
    {
        key: '3',
        title: 'id продажи',
    },
    {
        key: '4',
        title: 'Компания',
    },
    {
        key: '5',
        title: 'С кем',
    },
    {
        key: '6',
        title: 'Комментарий',
        filtration: 'position',
        sorting: null,
    },
];

type Props = {
    classes: Object,
    currentPage: number,
    totalElements: number,
    activities: Object,
    loading: Boolean,
    onHandlePageChange: () => void,
    userRoles: Array<string>,
}

type ActivityType = {
    type: string,
    typeEnumCode: string,
};

class ActivitiesTable extends PureComponent<Props> {
    showNotification = () => {
        Notification.showMessage({
            message: 'Нет прав доступа для просмотра страницы',
            closeTimeout: 15000,
        });
    };

    transformActivityTypes = (types: Array<ActivityType>) => types.map(({ type }) => type).join('/');

    renderLink = row => {
        const { userRoles, classes } = this.props;

        if (userRoles.length === 1 && userRoles[0] === ADMIN) {
            return (
                <span
                    onClick={this.showNotification}
                    className={classes.salesLink}
                >
                    {row.companySale}
                </span>
            );
        }

        return (<Link to={`${SALES_LINK}${row.companySale}`}>{row.companySale}</Link>);
    };

    renderTableHead = () => {
        const { classes } = this.props;

        return (
            <TableHead>
                <TableRow className={classes.tableHeader}>
                    {tableHeaderItems.map((cell => (
                        <TableCell className={classes.tableCell} key={cell.key}>
                            <Grid
                                item
                                className={classes.tableTitle}
                            >
                                <Grid>{cell.title}</Grid>
                            </Grid>
                        </TableCell>
                    )))}
                </TableRow>
            </TableHead>
        );
    }

    renderTableBody = () => {
        const { activities, classes } = this.props;

        return (
            <TableBody>
                {!!activities.content && activities.content.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className={classes.tableDate} align='left'>{getFormattedDate(row.dateActivity)}</TableCell>
                        <TableCell align='left'>{this.transformActivityTypes(row.types)}</TableCell>
                        <TableCell align='left'>
                            {this.renderLink(row)}
                        </TableCell>
                        <TableCell align='left'>{row.companyName}</TableCell>
                        <TableCell align='left'>{row.contacts.map(contact => `${contact.firstName} ${contact.lastName}`)}</TableCell>
                        <Comment description={row.description} />
                    </TableRow>
                ))}
            </TableBody>
        );
    }

    renderPagination = () => {
        const {
            classes,
            currentPage,
            totalElements,
            onHandlePageChange,
        } = this.props;

        return (
            <TableFooter>
                <TableRow>
                    <SelectablePagination
                        classes={{
                            toolbar: classes.pagination,
                            spacer: classes.spacer,
                        }}
                        rowsPerPageOptions={[PAGE_SIZE]}
                        count={totalElements}
                        rowsPerPage={PAGE_SIZE}
                        page={currentPage}
                        onChangePage={onHandlePageChange}
                        component='td'
                    />
                </TableRow>
            </TableFooter>
        );
    };

    renderErrorMessage = () => {
        const { classes } = this.props;

        return (
            <Typography
                variant='caption'
                align='center'
                className={classes.noData}
            >
                {NO_DATA_FOUND_MESSAGE}
            </Typography>
        );
    }

    renderSpinner = () => {
        const { classes } = this.props;

        return <CircularProgress className={classes.loading} />;
    };


    render() {
        const { classes, activities, loading } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    {this.renderTableHead()}
                    {this.renderTableBody()}
                    {!isEmpty(activities) && this.renderPagination()}
                </Table>
                {isEmpty(activities.content) && this.renderErrorMessage()}
                {loading && this.renderSpinner()}
            </Paper>
        );
    }
}
export default withStyles(styles)(ActivitiesTable);
