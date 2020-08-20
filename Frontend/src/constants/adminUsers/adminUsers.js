// @flow

export const PAGE_SIZE = 50;
export const MAX_INPUT_LENGTH = 600;
export const IS_ACTIVE_ALL = [true, false];
export const CRM_BOT_LOGIN = 'site';

export const ACTION = {
    GET_USERS_SUCCESS: 'GET_USERS',
    GET_USERS_ERROR: 'GET_USERS_ERROR',
    GET_USERS_LOADING: 'GET_USERS_LOADING',
    GET_SALES_USER_SUCCESS: 'GET_SALES_USER_SUCCESS',
    GET_SALES_USER_ERROR: 'GET_SALES_USER_ERROR',
    GET_SALES_USER_LOADING: 'GET_SALES_USER_LOADING',
    SET_FILTERS: 'SET_FILTERS',
    RESET_USERS_STORE: 'RESET_USERS_STORE',
};

export const NO_DATA_FOUND_MESSAGE = 'Нет данных для отображения';

export const FILTRATION_COLUMN_KEYS = {
    NAME: 'name',
    EMAIL: 'email',
    LOGIN: 'login',
    ROLE: 'role',
    SKYPE: 'skype',
    POSITION: 'position',
    STATUS: 'isActive',
};

export const DEFAULT_FILTERS = {
    name: null,
    email: null,
    login: null,
    role: null,
    skype: null,
    position: null,
    isActive: null,
};

export const POPOVER_INFO = 'Ссылку на смену пароля можно отправить только пользователю, зарегистрированному не по корпоративному e-mail.';
