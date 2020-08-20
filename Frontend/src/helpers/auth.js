// @flow

import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    USER_SESSION_DATA,
    PREV_USER_SESSION_DATA,
} from 'crm-constants/authConstants';
import type { UserSessionData } from '../stores/session/SessionStore.flow';

export default {
    saveAccessToken(jwt: string) {
        localStorage.setItem(ACCESS_TOKEN, jwt);
    },

    saveRefreshToken(jwt: string) {
        localStorage.setItem(REFRESH_TOKEN, jwt);
    },

    saveUserData(data: UserSessionData) {
        localStorage.setItem(USER_SESSION_DATA, JSON.stringify(data));
    },

    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN),

    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN),

    getUserData: (): UserSessionData | null => {
        const userData = localStorage.getItem(USER_SESSION_DATA);

        return userData ? JSON.parse(userData) : null;
    },

    checkAuth: () => !!localStorage.getItem(ACCESS_TOKEN),

    removeToken() {
        localStorage.removeItem(ACCESS_TOKEN);
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN);
    },

    removeUserData() {
        const prevUserData = localStorage.getItem(USER_SESSION_DATA);

        prevUserData && sessionStorage.setItem(PREV_USER_SESSION_DATA, prevUserData);

        localStorage.removeItem(USER_SESSION_DATA);
    },

    eraseSessionData() {
        this.removeToken();
        this.removeRefreshToken();
        this.removeUserData();
    },

    isPrevUserDataAvailable() {
        const prevUserData: ?string = sessionStorage.getItem(PREV_USER_SESSION_DATA);

        return !!prevUserData;
    },

    isUserSameAsPrev() {
        const prevUserData: ?string = sessionStorage.getItem(PREV_USER_SESSION_DATA);
        const currentUserData: ?string = localStorage.getItem(USER_SESSION_DATA);

        if (!prevUserData || !currentUserData) {
            return false;
        }

        const prevUserId = JSON.parse(prevUserData).id;
        const activeUserId = JSON.parse(currentUserData).id;

        return prevUserId === activeUserId;
    },
};
