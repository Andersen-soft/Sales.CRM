// @flow

import React, { useEffect } from 'react';
import type { Element, Node } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'crm-hooks/useTranslation';
import crmSocket, { SUBSCRIPTIONS_PAGE_KEYS as KEYS } from 'crm-helpers/api/crmSocket';
import { RETURN_TO_QUEUE, SALE_IN_DAY_AUTO_DISTRIBUTION } from 'crm-constants/common/constants';
import { pages } from 'crm-constants/navigation';
import { SALES } from 'crm-constants/roles';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getSales } from 'crm-api/desktopService/salesService';
import Message from './Message';

type Props = {
    currentUser: Object,
    children: Node,
}

const BasisSubscription = ({
    currentUser,
    children,
}: Props) => {
    const translations = {
        sale: useTranslation('sale.sale'),
        saleUnavailable: useTranslation('sale.saleUnavailable'),
        returnToQueue: useTranslation('sale.returnToQueue'),
        crmBot: useTranslation('sale.crmBot'),
        distributionNotification: useTranslation('sale.distributionNotification'),
        followLink: useTranslation('sale.followLink'),
    };

    const showNotification = (message: Element<any> | string) => Notification.showMessage({
        message,
        type: 'notification',
        closeTimeout: 60000 * 10,
        isHidenIcon: true,
    });

    const checkSaleInDayDistribution = async () => {
        const { content } = await getSales({
            dayDistributionEmployeeId: currentUser.id,
            inDayAutoDistribution: true,
        });

        if (content.length) {
            const currentUrl = window.location.pathname;

            const prepareData = content.map(({ id, company: { name } }) => ({ id, name }))
                .filter(({ id }) => `${pages.SALES_FUNNEL}/${id}` !== currentUrl);

            prepareData.length && showNotification(<Message
                sales={prepareData}
                textBefore={`${translations.crmBot} ${translations.distributionNotification} `}
                textAfter={translations.followLink}
            />);
        }
    };

    const handlerSocketDayDistribution = socketMessage => {
        const { companySaleId, companyName, employeeId } = JSON.parse(socketMessage.body);
        const autoDistributionSalePage = `${pages.SALES_FUNNEL}/${companySaleId}`;
        const currentUrl = window.location.pathname;

        if (currentUser.id === employeeId && (autoDistributionSalePage !== currentUrl)) {
            const message = <Message
                sales={[{ id: companySaleId, name: companyName }]}
                textBefore={`${translations.crmBot} ${translations.distributionNotification} `}
                textAfter={translations.followLink}
            />;

            showNotification(message);
        }
    };

    const handlerSocketReturnToQueue = socketMessage => {
        const { companyName, employeeId } = JSON.parse(socketMessage.body);

        if (currentUser.id === employeeId) {
            const message = `${translations.sale} ${companyName} ${translations.saleUnavailable}.
             ${translations.returnToQueue}.`;

            showNotification(message);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.roles.includes(SALES)) {
            crmSocket.subscribe(SALE_IN_DAY_AUTO_DISTRIBUTION, handlerSocketDayDistribution, KEYS.Basis);
            crmSocket.subscribe(RETURN_TO_QUEUE, handlerSocketReturnToQueue, KEYS.Basis);

            crmSocket.activate();
            checkSaleInDayDistribution();
        } else {
            Notification.closeMessage();
        }

        return () => crmSocket.deactivate(KEYS.Basis);
    }, [currentUser]);

    return children;
};

export default connect(
    state => ({ currentUser: state.session.userData }),
    null,
)(BasisSubscription);
