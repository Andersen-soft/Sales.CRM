// @flow

import type { Contact } from 'crm-types/resourceDataTypes';

export default function transformContactArray(contactsArray: Array<Contact>) {
    return contactsArray.reduce((result, item) => {
        const {
            lastName = '',
            firstName = '',
        } = item;

        result.push({
            fullName: `${lastName} ${firstName}`,
            info: item,
        });

        return result;
    }, []);
}
