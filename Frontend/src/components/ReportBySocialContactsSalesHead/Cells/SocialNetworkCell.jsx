// @flow

import React from 'react';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMSocialNetworkIconLink from 'crm-ui/CRMSocialNetworkIconLink/CRMSocialNetworkIconLink';

type Props = {
    values: ?string,
};

const SocialNetworkCell = ({
    values: site,
}: Props) => {
    return site
        ? <CRMSocialNetworkIconLink link={site} />
        : <CRMEmptyBlock />;
};

export default SocialNetworkCell;
