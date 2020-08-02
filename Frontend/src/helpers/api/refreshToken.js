import { URL_REFRESH } from 'crm-constants/authConstants';
import auth from 'crm-helpers/auth';

import crmRequest from './crmRequest';

const refreshToken = () => crmRequest({
    url: URL_REFRESH,
    data: { token: auth.getRefreshToken() },
});

export default refreshToken;
