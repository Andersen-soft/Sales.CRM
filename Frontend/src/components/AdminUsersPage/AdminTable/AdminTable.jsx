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
    Tooltip,
    IconButton,
    Typography,
    CircularProgress,
} from '@material-ui/core';
import { Edit, Visibility, VpnKeySharp } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { isEmpty, isNil, pathOr } from 'ramda';
import { Link } from 'react-router-dom';

import { pages } from 'crm-constants/navigation';
import {
    PAGE_SIZE, NO_DATA_FOUND_MESSAGE, FILTRATION_COLUMN_KEYS, POPOVER_INFO, CRM_BOT_LOGIN,
} from 'crm-constants/adminUsers/adminUsers';
import { sendLinkToChangePassword } from 'crm-api/adminUsersService';
import SelectablePagination from 'crm-components/common/pagination';
import Filtration from 'crm-components/common/FiltrationComponent';
import InputFilter from 'crm-components/AdminUsersPage/AdminTable/filters/InputFilter';
import CheckboxFilter from 'crm-components/AdminUsersPage/AdminTable/filters/CheckboxFilter';
import Notification from 'crm-components/notification/NotificationSingleton';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import type { ISaleProps } from 'crm-types/adminUsers';
import PopoverInfo from './PopoverInfo/PopoverInfo';
import EditUserModal from './EditUserModal';
import styles from './styles';


export const tableHeaderItems: Array<Object> = [
    {
        key: '1',
        title: 'ФИО',
        filtration: 'name',
        sorting: null,
    },
    {
        key: '2',
        title: 'e-mail',
        filtration: 'email',
        sorting: null,
    },
    {
        key: '3',
        title: 'Логин',
        filtration: 'login',
        sorting: null,
    },
    {
        key: '4',
        title: 'Роль',
        filtration: 'role',
        sorting: null,
    },
    {
        key: '5',
        title: 'Skype',
        filtration: 'skype',
        sorting: null,
    },
    {
        key: '6',
        title: 'Должность',
        filtration: 'position',
        sorting: null,
    },
    {
        key: '7',
        title: 'Часовой пояс',
        filtration: null,
        sorting: null,
    },
    {
        key: '8',
        title: 'Статус',
        filtration: 'isActive',
        sorting: null,
    },
    {
        key: '9',
        title: 'Дополнительная информация',
        filtration: null,
        sorting: null,
    },
];

type Props = {
    classes: Object,
    currentPage: number,
    totalElements: number,
    users: Object,
    loading: Boolean,
    onHandlePageChange: () => void,
    setUsers: (page: number) => void,
    scrollToTable: () => void,
    filters: Object,
    onSetFilters: () => void,
    requestDataForFilters: () => void,
    resetAdminUsersStore: () => void,
    history: Object,
} & ISaleProps;

type State = {
    openEditModal: boolean,
    editId: null | number,
    confirmationResetPassword: boolean,
    userName: string
}

class AdminTable extends PureComponent<Props, State> {
    state = {
        openEditModal: false,
        editId: null,
        confirmationResetPassword: false,
        userName: '',
    };

    componentDidMount() {
        const { users } = this.props;

        isEmpty(users) && this.props.setUsers(0);
    }

    componentDidUpdate() {
        const { users } = this.props;

        isEmpty(users) && this.props.setUsers(0);
    }

    componentWillUnmount() {
        const { history } = this.props;

        history.location.pathname.indexOf('users/') === -1 && this.props.resetAdminUsersStore();
    }

    getFiltrationComponent = (filtration: string | null) => {
        switch (filtration) {
            case FILTRATION_COLUMN_KEYS.STATUS:
                return CheckboxFilter;
            case FILTRATION_COLUMN_KEYS.ROLE:
                return CheckboxFilter;
            default:
                return InputFilter;
        }
    };

    handleToggleModal = editId => () => {
        this.setState(prevState => ({
            openEditModal: !prevState.openEditModal,
            editId,
        }));
    };

    handleConfirmationResetOpen = (editId, userName) => () => this.setState({ confirmationResetPassword: true, editId, userName });

    handleConfirmationResetClose = () => this.setState({ confirmationResetPassword: false, editId: null });

    handleSendLinkToChangePassword = () => {
        const { editId } = this.state;

        sendLinkToChangePassword(editId)
            .then(response => Notification.showMessage({
                message: response,
                type: 'success',
                closeTimeout: 4000,
            }))
            .then(() => this.handleConfirmationResetClose())
            .catch(error => Notification.showMessage({
                message: pathOr(null, ['data', 'errorMessage'], error.response),
                closeTimeout: 7000,
            }));
    };

    renderFilterPopup = (filtration: string | null) => {
        const { filters, onSetFilters, requestDataForFilters } = this.props;

        return (
            <Filtration
                component={this.getFiltrationComponent(filtration)}
                columnKey={filtration}
                onSetFilters={onSetFilters}
                requestDataForFilters={requestDataForFilters}
                filters={filters}
            />
        );
    };

    renderTableHead = () => {
        const { classes } = this.props;

        return (
            <TableHead>
                <TableRow className={classes.tableHeader}>
                    {tableHeaderItems.map((cell => (
                        <TableCell key={cell.key}>
                            <Grid
                                item
                                className={classes.tableTitle}
                            >
                                <Grid>{!isNil(cell.filtration) && this.renderFilterPopup(cell.filtration)}</Grid>
                                <Grid>{cell.title}</Grid>
                            </Grid>
                        </TableCell>
                    )))}
                    <TableCell className={classes.popoverInfo}>
                        <PopoverInfo description={POPOVER_INFO} />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                </TableRow>
            </TableHead>
        );
    };

    renderTableBody = () => {
        const { users, classes } = this.props;
        const filteredUsers = users.content && users.content.filter(({ login }) => login !== CRM_BOT_LOGIN);

        return (
            <TableBody>
                {!!filteredUsers && filteredUsers.map(row => (
                    <TableRow key={row.id}>
                        <TableCell align='left'>
                            {`${row.firstName} ${row.lastName}`}
                        </TableCell>
                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='left'>{row.login}</TableCell>
                        <TableCell align='left'>{row.roles.map(role => role.name).join(' ')}</TableCell>
                        <TableCell align='left'>{row.skype}</TableCell>
                        <TableCell align='left'>{row.position}</TableCell>
                        <TableCell align='left'>UTC+3:00 (Москва-Минск)</TableCell>
                        <TableCell align='left'>{row.isActive ? 'Активный' : 'Неактивный'}</TableCell>
                        <TableCell align='left'>{row.additionalInfo}</TableCell>
                        <TableCell className={classes.edit}>
                            {!row.isLdapUser && <Tooltip title='Отправить ссылку на смену пароля' disableFocusListener>
                                <IconButton
                                    className={classes.tableButton}
                                    onClick={this.handleConfirmationResetOpen(row.id, `${row.firstName} ${row.lastName}`)}
                                >
                                    <VpnKeySharp />
                                </IconButton>
                            </Tooltip>}
                        </TableCell>
                        <TableCell className={classes.edit}>
                            <Tooltip title='Редактировать' disableFocusListener>
                                <IconButton onClick={this.handleToggleModal(row.id)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                        <TableCell className={classes.activities}>
                            <Tooltip title='Просмотреть активности' disableFocusListener>
                                <Link to={`${pages.ADMIN_USERS}/${row.id}`} className={classes.link}>
                                    <IconButton>
                                        <Visibility />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

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
                display='block'
                className={classes.noData}
            >
                {NO_DATA_FOUND_MESSAGE}
            </Typography>
        );
    };

    renderSpinner = () => {
        const { classes } = this.props;

        return <CircularProgress className={classes.loading} />;
    };

    renderConfirmText = () => {
        const { userName } = this.state;
        const textTitle = `Отправить ссылку для смены пароля пользователю ${userName}? `;

        return (
            <Grid container>
                <Typography variant='h6'>{textTitle}</Typography>
            </Grid>
        );
    };

    render() {
        const {
            classes, users, loading, setUsers, sales, isSalesLoading, fetchSales,
        } = this.props;
        const {
            openEditModal, editId, confirmationResetPassword,
        } = this.state;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    {this.renderTableHead()}
                    {this.renderTableBody()}
                    {!isEmpty(users) && this.renderPagination()}
                </Table>
                {isEmpty(users) && this.renderErrorMessage()}
                {loading && this.renderSpinner()}
                <EditUserModal
                    open={openEditModal}
                    editId={editId}
                    users={users}
                    setUsers={setUsers}
                    onToggleModal={this.handleToggleModal(editId)}
                    sales={sales}
                    isSalesLoading={isSalesLoading}
                    fetchSales={fetchSales}
                />
                <CancelConfirmation
                    showConfirmationDialog={confirmationResetPassword}
                    onConfirmationDialogClose={this.handleConfirmationResetClose}
                    onConfirm={this.handleSendLinkToChangePassword}
                    text={this.renderConfirmText()}
                />
            </Paper>
        );
    }
}
export default withStyles(styles)(AdminTable);
