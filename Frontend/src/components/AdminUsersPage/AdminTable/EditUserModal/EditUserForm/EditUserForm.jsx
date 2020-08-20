// @flow

import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import cn from 'classnames';
import { withFormik } from 'formik';
import { pathOr } from 'ramda';
import {
    DialogContent,
    Grid,
    Typography,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    Tooltip,
    Paper,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { INPUT_REQUIRED_ERR, CYRILLIC_ERR } from 'crm-constants/forms';
import { CYRILLIC_REGEXP, EMAIL_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import transformDataForRegister from 'crm-utils/AdminUsers/transformDataForRegister';
import transformDataForSetRoles from 'crm-utils/AdminUsers/transformDataForSetRoles';
import Input from 'crm-components/common/Input';
import CommentTextField from 'crm-components/common/TextField/CommentTextField';
import AutoComplete from 'crm-components/common/AutoComplete';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import Notification from 'crm-components/notification/NotificationSingleton';
import {
    requestDataForFiltersActions as getRoles,
    updateUser,
} from 'crm-api/adminUsersService';
import CRMIcon from 'crm-icons';
import { SALE_ASSISTANT_ID, SITE, SALE_ID, RM_ID } from 'crm-constants/roles';

import type { ISaleProps } from 'crm-types/adminUsers';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Введите валидный e-mail').required(INPUT_REQUIRED_ERR),
    login: Yup.string().required(INPUT_REQUIRED_ERR),
    firstName: Yup.string().required(INPUT_REQUIRED_ERR),
    lastName: Yup.string().required(INPUT_REQUIRED_ERR),
    roles: Yup.array().of(Yup.object().shape({
        value: Yup.number(),
    })).transform((currentValue, originalValue) => {
        if (Array.isArray(originalValue)) {
            return originalValue;
        }

        return [originalValue];
    }).required(INPUT_REQUIRED_ERR),
    mentor: Yup.string()
        .when('roles', {
            is: roles => (roles ? roles.some(({ value }) => value === SALE_ASSISTANT_ID) : false),
            then: Yup.string()
                .required(INPUT_REQUIRED_ERR),
        })
        .nullable(),
    skype: Yup.string(),
    position: Yup.string(),
    status: Yup.string(),
    additionalInfo: Yup.string(),
    lotteryParticipantNight: Yup.boolean(),
    lotteryParticipantDay: Yup.boolean(),
    telegramUsername: Yup.string()
        .when(['lotteryParticipantNight', 'lotteryParticipantDay'], {
            is: (lotteryParticipantNight, lotteryParticipantDay) => lotteryParticipantNight || lotteryParticipantDay,
            then: Yup.string()
                .required(INPUT_REQUIRED_ERR),
        })
        .nullable(),
    responsibleRM: Yup.boolean(),
});

const validate = values => {
    const errors = [];

    values.additionalEmails.forEach((email, index) => {
        if (email.length && !EMAIL_REGEXP.test(email)) {
            errors[index] = 'Введите валидный e-mail';
        }
    });

    return errors.length ? { additionalEmails: errors } : {};
};

const statuses = [
    {
        label: 'Активный',
        value: 1,
    },
    {
        label: 'Неактивный',
        value: 0,
    },
];

type Roles = {
    value?: number,
    label?: string,
    isDisabled?: boolean,
}

type Values = {
    email: string,
    login: string,
    firstName: string,
    lastName: string,
    roles: Roles | Array<Roles>,
    skype: string,
    position: string,
    status: string,
    mentor?: number,
    additionalInfo: string,
    lotteryParticipantNight: boolean,
    lotteryParticipantDay: boolean,
    telegramUsername: string,
    responsibleRM: boolean,
    additionalEmails: Array<string>,
} & ISaleProps;

type Props = {
    handleChange: (param: string | Object) => Function,
    setFieldTouched: (name: string, value: boolean, shouldValidate?: boolean) => void,
    setFieldError: (name: string, errorMsg: string) => void,
    values: Values,
    touched: Values,
    errors: Values,
    editId: number,
    users: Object,
    handleSubmit: () => void,
    classes: Object,
    onHandleOnClose: () => void,
    onHandleConfirmationDialogOpen: () => void,
    showConfirmationDialog: () => void,
    onHandleConfirmationDialogClose: () => void,
} & ISaleProps;

const CorporateUserForm = ({
    values,
    touched,
    errors,
    handleSubmit,
    classes,
    onHandleConfirmationDialogOpen,
    showConfirmationDialog,
    onHandleConfirmationDialogClose,
    onHandleOnClose,
    sales,
    handleChange,
    setFieldTouched,
    setFieldError,
    editId,
    users,
    fetchSales,
    isSalesLoading,
}: Props) => {
    const [roles, setRoles] = useState([]);
    const [isLdapUser, setIsLdapUser] = useState(false);
    const [localSalesSuggestions, setLocalSalesSuggestions] = useState([]);
    const [disableDistribution, setDisableDistribution] = useState(false);

    useEffect(() => {
        const salesSuggestions = sales.map(({ firstName, lastName, id }) => ({
            label: `${lastName} ${firstName}`,
            value: id,
        }));

        setLocalSalesSuggestions(salesSuggestions);
    }, [sales]);

    const toggleRoles = (predicate?: Function) => {
        const updatedRoles = roles.map(({ label, value }) => ({
            label,
            value,
            isDisabled: predicate ? predicate(value) : false,
        }));

        setRoles(updatedRoles);
    };

    const checkingForSelectedRoles = () => {
        const { roles: selectedRoles } = values;

        if (!Array.isArray(selectedRoles)) {
            selectedRoles.value === SALE_ASSISTANT_ID && toggleRoles(id => id !== SALE_ASSISTANT_ID);
        }
    };

    const getAllRoles = async () => {
        try {
            const allRoles = await getRoles();

            const transformRoles = allRoles.filter(({ name }) => name !== SITE).map(value => ({
                label: value.name,
                value: value.id,
                isDisabled: false,
            }));

            setRoles(transformRoles);
            checkingForSelectedRoles();
        } catch (error) {
            Notification.showMessage({
                message: error.response.data.errorMessage,
                closeTimeout: 15000,
            });
        }
    };

    const setField = (userData, name) => {
        const changeField = handleChange(name);

        changeField(userData);
    };

    const getSalesAssistant = (role: Array<Roles>): Roles | Array<Roles> => {
        const salesAssistant = role.find(someRole => someRole.value === SALE_ASSISTANT_ID);

        if (salesAssistant) {
            toggleRoles(id => id !== SALE_ASSISTANT_ID);
            return salesAssistant;
        }

        toggleRoles();
        return role.length > 1 ? role : role[0];
    };

    const isRoleSelected = (roleId: number, selectedRoles) => {
        if (Array.isArray(selectedRoles)) {
            return !!selectedRoles.find(({ value }) => value === roleId);
        }

        return selectedRoles && selectedRoles.value === roleId;
    };

    const handleRoleChange = (role: Array<Roles> | null) => {
        const changeRole = handleChange('roles');
        const changeLotteryParticipantNight = handleChange('lotteryParticipantNight');
        const changeLotteryParticipantDay = handleChange('lotteryParticipantDay');
        const changeResponsibleRM = handleChange('responsibleRM');

        const selectedRoles = getSalesAssistant(role || []) || '';

        if (!changeRole) {
            return;
        }

        if (!isRoleSelected(SALE_ID, selectedRoles)) {
            changeLotteryParticipantNight(false);
            changeLotteryParticipantDay(false);
        }

        if (!isRoleSelected(RM_ID, selectedRoles)) {
            changeResponsibleRM(false);
        }

        changeRole(selectedRoles);
        setFieldTouched('roles', true);
    };

    const setFieldValue = user => {
        setField(user.email, 'email');
        setField(user.login, 'login');
        setField(user.firstName, 'firstName');
        setField(user.lastName, 'lastName');
        setField(user.skype || '', 'skype');
        setField(user.position || '', 'position');
        setField(user.additionalInfo || '', 'additionalInfo');
        setField(user.isActive ? statuses[0] : statuses[1], 'status');
        setField(user.lotteryParticipantNight || false, 'lotteryParticipantNight');
        setField(user.lotteryParticipantDay || false, 'lotteryParticipantDay');
        setField(user.telegramUsername || '', 'telegramUsername');
        setField(pathOr(false, ['responsibleRM'], user), 'responsibleRM');
        setField(
            user.mentor
                ? { label: `${user.mentor.lastName} ${user.mentor.firstName}`, id: user.mentor.id }
                : null,
            'mentor',
        );

        const additionalEmails = pathOr([''], ['additionalEmails'], user);

        setField(additionalEmails.length ? additionalEmails : [''], 'additionalEmails');
        const userRoles = transformDataForSetRoles(user.roles);

        handleRoleChange(userRoles);
    };

    useEffect(() => {
        getAllRoles();

        const user = users.content.find(({ id }) => id === editId);

        setFieldValue(user);
        setIsLdapUser(user.isLdapUser);

        !user.isActive && setDisableDistribution(true);

        !isSalesLoading && fetchSales && fetchSales();
    }, []);

    const handleOnChange = (name: string) => (e: SyntheticInputEvent<HTMLInputElement>) => {
        handleChange(e);
        setFieldTouched(name, true);
    };

    const isMentorDisabled = () => {
        const { roles: rolesList } = values;

        if (!Array.isArray(rolesList)) {
            return rolesList.value !== SALE_ASSISTANT_ID;
        }

        return true;
    };

    const handleChangeStatus = (status: Object) => {
        const changeStatus = handleChange('status');
        const changeLotteryParticipantNight = handleChange('lotteryParticipantNight');
        const changeLotteryParticipantDay = handleChange('lotteryParticipantDay');
        const changeResponsibleRM = handleChange('responsibleRM');

        if (!changeStatus) {
            return;
        }
        setDisableDistribution(!status.value);

        changeLotteryParticipantNight(false);
        changeLotteryParticipantDay(false);
        changeResponsibleRM(false);
        changeStatus(status);
    };

    const handleChangeTelegramName = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        const nameWithoutAt = value.slice(1);

        if (!CYRILLIC_REGEXP.test(nameWithoutAt)) {
            const changeTelegramName = handleChange('telegramUsername');

            if (!changeTelegramName) {
                return;
            }

            changeTelegramName(nameWithoutAt);
            setFieldTouched('telegramUsername', true);
        } else {
            setFieldTouched('telegramUsername', true, false);
            setFieldError('telegramUsername', CYRILLIC_ERR);
        }
    };

    const addAdditionalEmail = () => {
        const emails = values.additionalEmails;

        setField([...emails, ''], 'additionalEmails');
    };

    const onChangeAdditionalEmail = (value, index) => {
        const changedEmails = [...values.additionalEmails];

        changedEmails[index] = value;
        setField(changedEmails, 'additionalEmails');
    };

    const deleteAdditionalEmail = (deleteIndex: number) => {
        setField(
            values.additionalEmails.filter((item, index) => index !== deleteIndex),
            'additionalEmails'
        );
    };

    return (
        <DialogContent classes={{ root: classes.content }}>
            <form onSubmit={handleSubmit}>
                <Grid
                    container
                    direction='column'
                    justify='flex-start'
                    alignItems='stretch'
                    spacing={0}
                >
                    <Grid
                        item
                        className={cn(classes.row, classes.email)}
                    >
                        <Input
                            fullWidth
                            name='email'
                            label='e-mail*'
                            value={values.email}
                            onChange={handleOnChange('email')}
                            error={touched.email && errors.email}
                            className={classes.input}
                            isDisable={isLdapUser}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='login'
                            label='Логин*'
                            value={values.login}
                            onChange={handleOnChange('login')}
                            error={touched.login && errors.login}
                            className={classes.input}
                            isDisable={isLdapUser}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='firstName'
                            label='Имя*'
                            value={values.firstName}
                            error={touched.firstName && errors.firstName}
                            onChange={handleOnChange('firstName')}
                            className={classes.input}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='lastName'
                            value={values.lastName}
                            error={touched.lastName && errors.lastName}
                            onChange={handleOnChange('lastName')}
                            label='Фамилия*'
                            className={classes.input}
                        />
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.row, classes.select)}
                    >
                        <AutoComplete
                            options={roles}
                            containerStyles={{ marginTop: 22 }}
                            minInputWidth={400}
                            placeholder='Роли*'
                            value={values.roles}
                            error={touched.roles && errors.roles}
                            name='roles'
                            onChange={handleRoleChange}
                            isMulti
                        />
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.row, classes.select)}
                    >
                        <AutoComplete
                            options={localSalesSuggestions}
                            isDisabled={isMentorDisabled()}
                            containerStyles={{ marginTop: 22 }}
                            minInputWidth={400}
                            placeholder='Ментор'
                            label='Ментор'
                            value={values.mentor}
                            error={touched.status && errors.mentor}
                            name='roles'
                            onChange={handleChange('mentor')}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='skype'
                            label='Skype'
                            value={values.skype}
                            onChange={handleOnChange('skype')}
                            className={classes.input}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='position'
                            label='Должность'
                            value={values.position}
                            onChange={handleOnChange('position')}
                            className={classes.input}
                        />
                    </Grid>
                    <Grid item className={classes.time}>
                        <Typography variant='body2'>
                            Часовой пояс UTC+3:00 (Москва-Минск)
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.row, classes.select)}
                    >
                        <AutoComplete
                            options={statuses}
                            containerStyles={{ marginTop: 22 }}
                            minInputWidth={400}
                            placeholder='Статус'
                            value={values.status}
                            error={touched.status && errors.status}
                            name='roles'
                            onChange={handleChangeStatus}
                        />
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.row, classes.comment)}
                    >
                        <CommentTextField
                            fullWidth
                            name='additionalInfo'
                            label='Дополнительная информация'
                            value={values.additionalInfo}
                            onChange={handleOnChange('additionalInfo')}
                            showError={false}
                        />
                    </Grid>
                    {isRoleSelected(SALE_ID, values.roles)
                        && <>
                            <Grid item className={cn(classes.row, classes.leadAllocation)}>
                                <FormControlLabel
                                    disabled={disableDistribution}
                                    control={
                                        <Checkbox
                                            name='lotteryParticipantDay'
                                            checked={values.lotteryParticipantDay}
                                            onChange={handleOnChange('lotteryParticipantDay')}
                                            value={values.lotteryParticipantDay}
                                        />
                                    }
                                    label='Участвует в дневном распределении лидов'
                                    classes={{ label: classes.checkbox }}
                                />
                            </Grid>
                            <Grid item className={cn(classes.row, classes.leadAllocation)}>
                                <FormControlLabel
                                    disabled={disableDistribution}
                                    control={
                                        <Checkbox
                                            name='lotteryParticipantNight'
                                            checked={values.lotteryParticipantNight}
                                            onChange={handleOnChange('lotteryParticipantNight')}
                                            value={values.lotteryParticipantNight}
                                        />
                                    }
                                    label='Участвует в ночном распределении лидов'
                                    classes={{ label: classes.checkbox }}
                                />
                            </Grid>
                        </>}
                    <Grid item className={cn(classes.row, classes.leadAllocation)}>
                        <Input
                            fullWidth
                            name='telegramUsername'
                            label='Telegram @username'
                            value={`@${values.telegramUsername}`}
                            onChange={handleChangeTelegramName}
                            error={errors.telegramUsername}
                            className={classes.input}
                        />
                    </Grid>
                    {isRoleSelected(RM_ID, values.roles)
                        && <Grid item className={cn(classes.row, classes.leadAllocation)}>
                            <FormControlLabel
                                disabled={disableDistribution}
                                control={
                                    <Checkbox
                                        name='responsibleRM'
                                        checked={values.responsibleRM}
                                        onChange={handleOnChange('responsibleRM')}
                                        value={values.responsibleRM}
                                    />
                                }
                                label='Delivery Director'
                                classes={{ label: classes.checkbox }}
                            />
                        </Grid>}
                    <Paper
                        elevation={3}
                        className={classes.emailGroup}
                    >
                        Дополнительный e-mail
                        {values.additionalEmails.map((value, index) => <Grid
                            item
                            className={cn(classes.row, classes.additionalEmails)}
                            key={index}
                            container
                            wrap='nowrap'
                            alignItems='center'
                        >
                            <Input
                                fullWidth
                                value={value}
                                onChange={({ target: { value: additionalEmailValue } }) => onChangeAdditionalEmail(additionalEmailValue, index)}
                                error={errors.additionalEmails && errors.additionalEmails[index]}
                                className={classes.input}
                            />
                            <Tooltip title={'удалить e-mail'}>
                                <Grid>
                                    <CRMIcon
                                        IconComponent={ClearIcon}
                                        onClick={() => deleteAdditionalEmail(index)}
                                    />
                                </Grid>
                            </Tooltip>
                        </Grid>)}
                        <Tooltip title={'Добавить дополнительный e-mail'}>
                            <Grid className={classes.buttonAdd}>
                                <CRMIcon
                                    IconComponent={AddBoxIcon}
                                    onClick={addAdditionalEmail}
                                    className={classes.buttonAdd}
                                />
                            </Grid>
                        </Tooltip>
                    </Paper>
                </Grid>
                <DialogActions className={classes.actions}>
                    <Button
                        type='submit'
                        size='large'
                        variant='contained'
                        color='primary'
                    >
                        Сохранить
                    </Button>
                    <Button
                        className={classes.buttonCancel}
                        size='large'
                        variant='outlined'
                        onClick={onHandleConfirmationDialogOpen}
                    >
                        Отменить
                    </Button>
                    <CancelConfirmation
                        showConfirmationDialog={showConfirmationDialog}
                        onConfirmationDialogClose={
                            onHandleConfirmationDialogClose
                        }
                        onConfirm={onHandleOnClose}
                        text='Вы уверены, что хотите отменить редактирование пользователя?'
                        textAlignCenter
                    />
                </DialogActions>
            </form>
        </DialogContent>
    );
};

export default withFormik({
    mapPropsToValues: () => ({
        email: '',
        login: '',
        firstName: '',
        lastName: '',
        roles: '',
        skype: '',
        position: '',
        status: '',
        mentor: null,
        additionalInfo: '',
        lotteryParticipantNight: false,
        lotteryParticipantDay: false,
        telegramUsername: '',
        responsibleRM: false,
        additionalEmails: [''],
    }),
    handleSubmit: (values, props) => {
        const { editId, users } = props.props;
        const user = users.content.find(userData => userData.id === editId);

        updateUser(
            editId,
            transformDataForRegister(values, user.isLdapUser, true),
        )
            .then(() => props.props.onHandleOnClose())
            .then(() => Notification.showMessage({
                message: 'Пользователь успешно обновлён!',
                type: 'success',
                closeTimeout: 3000,
            }))
            .then(() => props.props.setUsers(
                pathOr(null, ['users', 'number'], props.props),
            ))
            .catch(error => Notification.showMessage({
                message: pathOr(null, ['data', 'errorMessage'], error.response),
                closeTimeout: 15000,
            }));
    },
    validate,
    validationSchema,
})(CorporateUserForm);
