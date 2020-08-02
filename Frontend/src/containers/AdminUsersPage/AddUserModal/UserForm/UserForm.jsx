// @flow

import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { pathOr } from 'ramda';
import debounce from 'lodash.debounce';
import { Clear, Search } from '@material-ui/icons';
import {
    Paper,
    DialogContent,
    Grid,
    FormControl,
    TextField,
    Typography,
    FormHelperText,
    DialogActions,
    Button,
    MenuItem,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Tooltip,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { INPUT_REQUIRED_ERR, CYRILLIC_ERR } from 'crm-constants/forms';
import { CYRILLIC_REGEXP, EMAIL_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import transformDataForRegister from 'crm-utils/AdminUsers/transformDataForRegister';
import Input from 'crm-components/common/Input';
import CommentTextField from 'crm-components/common/TextField/CommentTextField';
import AutoComplete from 'crm-components/common/AutoComplete';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import Notification from 'crm-components/notification/NotificationSingleton';
import {
    getCorpotateUsers, requestDataForFiltersActions as getRoles, registerUser,
} from 'crm-api/adminUsersService';
import CRMIcon from 'crm-icons';
import { SALE_ASSISTANT_ID, SALE_ID, SITE, RM_ID } from 'crm-constants/roles';

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

type Values = {
    email: string,
    login: string,
    firstName: string,
    lastName: string,
    roles: {
        value: string,
    },
    skype: string,
    position: string,
    status: string,
    additionalInfo: string,
    mentor?: number,
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
    handleSubmit: () => void,
    classes: Object,
    onHandleOnClose: () => void,
    onHandleConfirmationDialogOpen: () => void,
    showConfirmationDialog: () => void,
    onHandleConfirmationDialogClose: () => void
} & ISaleProps;

type Mentor = {
    label: string,
    value: Number
}

type Roles = {
    value?: number,
    label?: string,
    isDisabled?: boolean
}

const UserForm = ({
    classes,
    handleSubmit,
    values,
    touched,
    errors,
    fetchSales,
    setFieldTouched,
    handleChange,
    setFieldError,
    onHandleConfirmationDialogOpen,
    showConfirmationDialog,
    onHandleConfirmationDialogClose,
    onHandleOnClose,
    sales,
}: Props) => {
    const [corporateUsers, setCorporateUsers] = useState([]);
    const [searchEmailValue, setSearchEmailValue] = useState(null);
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [corporateForm, setCorporateForm] = useState(false);
    const [localSalesSuggestions, setLocalSalesSuggestions] = useState([]);

    useEffect(() => {
        const salesSuggestions = sales.map(({ firstName, lastName, id }) => ({
            label: `${lastName} ${firstName}`,
            value: id,
        }));

        setLocalSalesSuggestions(salesSuggestions);
    }, [sales]);

    const handleSearch = async (email: string) => {
        let users = await getCorpotateUsers(email);

        users = users.content.map((value, id) => ({
            value: value.email,
            id,
        }));

        setCorporateUsers(users);
    };

    const debouncedHandleSearch = useCallback(debounce((email: string) => handleSearch(email), 300), []);

    const getAllRoles = async () => {
        try {
            const allRoles = await getRoles();

            const transformRoles = allRoles.filter(({ name }) => name !== SITE).map(value => ({
                label: value.name,
                value: value.id,
                isDisabled: false,
            }));

            setRoles(transformRoles);
        } catch (error) {
            Notification.showMessage({ message: error.response.data.errorMessage, closeTimeout: 15000 });
        }
    };

    const getUsers = async () => {
        try {
            const users = await getCorpotateUsers();

            const transformCorporateUsers = users.content.map((value, id) => ({
                value: value.email,
                id,
            }));

            setCorporateUsers(transformCorporateUsers);
        } catch (error) {
            Notification.showMessage({ message: error.response.data.errorMessage, closeTimeout: 15000 });
        }
    };

    useEffect(() => {
        getUsers();
        getAllRoles();

        fetchSales && fetchSales();
    }, []);

    const toggleRoles = (predicate?: Function) => {
        const updatedRoles = roles.map(({ label, value }) => ({
            label,
            value,
            isDisabled: predicate ? predicate(value) : false,
        }));

        setRoles(updatedRoles);
    };

    const handleMentorChange = (mentor: Mentor | string) => {
        const changeRole = handleChange('mentor');

        changeRole(mentor);
    };

    const getSalesAssistant = (role: Array<Roles>): Roles | Array<Roles> => {
        const salesAssistant = role.find(someRole => someRole.value === SALE_ASSISTANT_ID);

        if (salesAssistant) {
            toggleRoles(id => id !== SALE_ASSISTANT_ID);
            return salesAssistant;
        }

        handleMentorChange('');
        toggleRoles();
        return role.length > 1 ? role : role[0];
    };

    const handleEmailChange = () => (e: SyntheticInputEvent<HTMLInputElement>) => {
        const userEmail = (e.target.value).trim();

        debouncedHandleSearch(userEmail);

        setAutoCompleteOpen(!!userEmail);
        setSearchEmailValue(userEmail);
        setCorporateForm(false);

        const changeLogin = handleChange('login');
        const changeFirstName = handleChange('firstName');
        const changeLastName = handleChange('lastName');

        changeLogin('');
        changeFirstName('');
        changeLastName('');

        handleChange(e);
        setFieldTouched('email', true);
    };

    const handleClearSearchValue = () => {
        setSearchEmailValue('');
        setAutoCompleteOpen(false);

        const changeEmail = handleChange('email');

        if (!changeEmail) {
            return;
        }

        changeEmail('');
    };

    const handleMenuItemClick = (value?: string) => async () => {
        setSearchEmailValue(value);
        setAutoCompleteOpen(false);
        setCorporateForm(true);

        const users = await getCorpotateUsers(value);
        const changeEmail = handleChange('email');
        const changeLogin = handleChange('login');
        const changeFirstName = handleChange('firstName');
        const changeLastName = handleChange('lastName');

        if (!changeEmail) {
            return;
        }

        changeEmail(value);
        changeLogin(users.content[0].login);
        changeFirstName(users.content[0].name.split(' ').shift());
        changeLastName(users.content[0].name.split(' ').slice(1).join(' '));
    };

    const handleOnChange = (name: string) => (e: SyntheticInputEvent<HTMLInputElement>) => {
        handleChange(e);
        setFieldTouched(name, true);
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

        if (!isRoleSelected(RM_ID, selectedRoles) && changeResponsibleRM) {
            changeResponsibleRM(false);
        }

        changeRole(selectedRoles);
        setFieldTouched('roles', true);
    };

    const isMentorDisabled = () => {
        const { roles: selectedRoles } = values;

        if (!Array.isArray(selectedRoles)) {
            return selectedRoles.value !== SALE_ASSISTANT_ID;
        }

        return true;
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
        const changeAdditionalEmail = handleChange('additionalEmails');

        changeAdditionalEmail && changeAdditionalEmail([...emails, '']);
    };

    const onChangeAdditionalEmail = (value, index) => {
        const changedEmails = [...values.additionalEmails];
        const changeAdditionalEmail = handleChange('additionalEmails');

        changedEmails[index] = value;
        changeAdditionalEmail && changeAdditionalEmail(changedEmails);
    };

    const deleteAdditionalEmail = (deleteIndex: number) => {
        const changeAdditionalEmail = handleChange('additionalEmails');

        changeAdditionalEmail && changeAdditionalEmail(
            values.additionalEmails.filter((item, index) => index !== deleteIndex)
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
                    <Grid item className={classes.row}>
                        <FormControl
                            error
                            className={classes.searchInput}
                        >
                            <TextField
                                label='e-mail*'
                                name='email'
                                placeholder='Выберите e-mail из списка'
                                value={values.email}
                                error={touched.email && !!errors.email}
                                onChange={handleEmailChange()}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='start'>
                                            { searchEmailValue
                                                ? <Clear
                                                    className={classes.clearSearch}
                                                    onClick={handleClearSearchValue}
                                                />
                                                : <Search />
                                            }
                                        </InputAdornment>
                                    ),
                                    classes: { input: classes.input },
                                }}
                            />
                            <FormHelperText>
                                {touched.email && errors.email}
                            </FormHelperText>
                            {autoCompleteOpen && (
                                <Paper className={classes.searchValuesWrapper}>
                                    {corporateUsers.map(({ id, value }) => (
                                        <MenuItem
                                            key={id}
                                            value
                                            onClick={handleMenuItemClick(value)}
                                        >
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Paper>
                            )}
                        </FormControl>
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
                            isDisable={corporateForm}
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
                    <Grid item className={cn(classes.row, classes.select)}>
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
                            onChange={handleMentorChange}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='skype'
                            label='Skype'
                            onChange={handleOnChange('skype')}
                            className={classes.input}
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <Input
                            fullWidth
                            name='position'
                            label='Должность'
                            onChange={handleOnChange('position')}
                            className={classes.input}
                        />
                    </Grid>
                    <Grid item className={classes.time}>
                        <Typography variant='body2'>
                            Часовой пояс UTC+3:00 (Москва-Минск)
                        </Typography>
                    </Grid>
                    <Grid item className={cn(classes.row, classes.select)}>
                        <Input
                            fullWidth
                            name='status'
                            label='Статус'
                            value={values.status}
                            onChange={handleOnChange('status')}
                            className={classes.input}
                            isDisable
                        />
                    </Grid>
                    <Grid item className={classes.row}>
                        <CommentTextField
                            fullWidth
                            name='additionalInfo'
                            label='Дополнительная информация'
                            onChange={handleOnChange('additionalInfo')}
                            showError={false}
                        />
                    </Grid>
                    {isRoleSelected(SALE_ID, values.roles)
                    && <>
                        <Grid item className={cn(classes.row, classes.leadAllocation)}>
                            <FormControlLabel
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
                        </Grid>
                    }
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
                        onConfirmationDialogClose={onHandleConfirmationDialogClose}
                        onConfirm={onHandleOnClose}
                        text='Вы уверены, что хотите отменить добавление пользователя?'
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
        status: 'Активный',
        additionalInfo: '',
        mentor: null,
        lotteryParticipantNight: false,
        lotteryParticipantDay: false,
        telegramUsername: '',
        responsibleRM: false,
        additionalEmails: [''],
    }),
    isInitialValid: false,
    handleSubmit: (values, props) => {
        registerUser(transformDataForRegister(values))
            .then(() => props.props.onHandleOnClose())
            .then(() => Notification.showMessage({
                message: 'Пользователь успешно добавлен!',
                type: 'success',
                closeTimeout: 3000,
            }))
            .then(() => props.props.setUsers(pathOr(null, ['users', 'number'], props.props)))
            .catch(error => Notification.showMessage({
                message: error.response.data.errorMessage,
                closeTimeout: 15000,
            }));
    },
    validate,
    validationSchema,
})(UserForm);
