// @flow

export const PAGE_SIZE = 30;
export const CONTACTS_STATUS = 'Ожидает';
export const MESSAGE_MAX_HEIGHT = 43;

// Update version if you have to edit columns
export const SocialContactsHeaders = {
    version: '0.2.0',
    columnsVisible: {
        actions: true,
        created: true,
        message: true,
        linkLead: true,
        virtualContact: true,
        coordinator: true,
        source: true,
        firstName: true,
        lastName: true,
        sex: true,
        position: true,
        country: true,
        skype: true,
        email: true,
        emailPrivate: true,
        phone: true,
        company: true,
        site: true,
        companyPhone: true,
        dateOfBirth: true,
    },
};

export const SOCIAL_CONTACTS_COLUMNS: string = 'SOCIAL_CONTACTS_COLUMNS';

export const REQUIRED_FIELDS = [
    'message',
    'firstName',
    'lastName',
    'sex',
    'companyName',
    'country',
    'linkLead',
];

export const VALIDATED_FIELDS = [
    'siteCompany',
    'emailPrivate',
    'email',
    'linkLead',
];

export const TABLE_LINKS_CONSTANTS = {
    SOCIALS_LINK: 'linkLead',
    SITE_LINK: 'siteCompany',
    EMPTY_VALUE: '—',
};
