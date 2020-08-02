// @flow

export default (roles: Array<Object>): Array<Object> => roles.map(role => ({
    label: role.name,
    value: role.id,
}));
