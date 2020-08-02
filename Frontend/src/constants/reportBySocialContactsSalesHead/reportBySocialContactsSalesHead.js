// @flow

import Accepted from 'crm-static/customIcons/accepted.svg';
import Rejected from 'crm-static/customIcons/rejected.svg';
import Waiting from 'crm-static/customIcons/Waiting.svg';

export const PAGE_SIZE = 20;
export const ASSISTANT_KEY = 'assistant';
export const STATUS_KEY = 'status';
export const SOURCE_KEY = 'source';

export const APPLY = 'APPLY';
export const REJECT = 'REJECT';
export const AWAIT = 'AWAIT';
export const statusConfig = {
    APPLY: { icon: Accepted, title: 'allSocialNetworkAnswers.apply' },
    REJECT: { icon: Rejected, title: 'allSocialNetworkAnswers.reject' },
    AWAIT: { icon: Waiting, title: 'allSocialNetworkAnswers.await' },
};

export const ALL_SOCIAL_CONTACTS_FILTERS = 'all_social_contacts_filters';
