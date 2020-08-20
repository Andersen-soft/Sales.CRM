// @flow

import { path, flatten, uniq, propOr, prop } from 'ramda';
import {
    menuTabSettings,
    menuTabsByRole,
} from 'crm-constants/navigation';
import type { TabSettings } from 'crm-constants/navigation';
import {
    HEAD_SALES, ADMIN, HR, RM, MANAGER,
} from 'crm-constants/roles';
import { RESUME_REQUESTS_ALL, ADMIN_USERS } from 'crm-constants/navigation/pages';


export const getDefaultPage = (userRoles: Array<string>): string => {
    switch (true) {
        case userRoles.includes(HEAD_SALES):
        case userRoles.includes(HR):
        case userRoles.includes(RM):
        case userRoles.includes(MANAGER):
            return RESUME_REQUESTS_ALL;
        case userRoles.includes(ADMIN):
            return ADMIN_USERS;
        default:
            return path([userRoles[0], '0'], menuTabsByRole).link || '/';
    }
};

export const getMenuTabsForUser = (userRole: Array<string>): Array<string> => {
    const menuTabs = uniq(flatten(userRole.map(role => path([role], menuTabsByRole))));

    return menuTabs.sort((firstSortable, secondSortable) => firstSortable.menuPosition - secondSortable.menuPosition)
        .map(({ link }) => link);
};


export const getTabSettings = (page: string): TabSettings => (
    menuTabSettings[page] || {}
);

export const getParentPage = (link: string) => {
    return Object.keys(menuTabSettings).find(key => {
        switch (true) {
            case (link === key):
                return true;
            case (!!propOr(false, 'children', menuTabSettings[key])):
                return prop('children', menuTabSettings[key]).find(item => item.link === link);
            default: return false;
        }
    });
};
