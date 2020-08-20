// @flow

import React, { useState, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import { isArchiveStatus } from 'crm-utils/dataTransformers/sales/isSaleArchived';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import AddSaleModal from 'crm-components/AddSaleToExternal/AddSaleModal/AddSaleModal';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import Icon1C from 'crm-static/customIcons/default.svg';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import Notification from 'crm-components/notification/NotificationSingleton';
import { useTranslation } from 'crm-hooks/useTranslation';
import { USE_1C } from 'crm-constants/salePage/companyCardConstant';
import ReplaceCompanyModal from './ReplaceCompanyModal';

import type { SingleActivity } from 'crm-containers/SalePage/SaleCard';
import type { Company } from './AttributeProps.flow';

type Props = {
    searchCompanyList: Company[],
    searchCompanyHandler: string => Function,
    updateCompanyHandler: (id: number, saleId: number) => void,
    classes: Object,
    saleId: number,
    status: string,
    fetchSale: (id: number) => void,
    company: { id: number },
    fetchActivities: (saleId: number, size: number, page: number) => void,
    fetchContacts: (companyId: number) => void,
    userRoles?: Array<string>,
    applyId?: boolean,
    resumes: Array<?Object>,
    estimations: Array<?Object>,
    onChangeEdit: () => void,
    activities: Array<SingleActivity>,
    deleteSaleCard: (number) => void,
    isSaleExported: boolean,
    history: Object,
};

const HeaderWithModal = ({
    classes,
    applyId,
    userRoles,
    onChangeEdit,
    isSaleExported,
    resumes,
    estimations,
    status,
    activities,
    searchCompanyHandler,
    searchCompanyList,
    updateCompanyHandler,
    saleId,
    fetchActivities,
    fetchSale,
    fetchContacts,
    deleteSaleCard,
    history,
}: Props) => {
    const [replaceCompanyModalOpen, setReplaceCompanyModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const with1C = useMemo(() => process.env.USE_1C === USE_1C, []);

    const translations = {
        edit: useTranslation('sale.companySection.companyPopup.edit'),
        addTo1C: useTranslation('sale.companySection.companyPopup.addTo1C'),
        replaceCompany: useTranslation('sale.companySection.companyPopup.replaceCompany'),
        deleteSale: useTranslation('sale.companySection.companyPopup.deleteSale'),
        notificationCompanyCannotChanged: useTranslation('sale.companySection.notificationCompanyCannotChanged'),
        notificationSaleDelete: useTranslation('sale.saleSection.notificationSaleDelete'),
    };

    const handleAddNoticeCompany = () => {
        Notification.showMessage({
            message: translations.notificationCompanyCannotChanged,
            closeTimeout: 15000,
        });
    };

    const handleModalShow = () => setReplaceCompanyModalOpen(!replaceCompanyModalOpen);

    const getDotMenuConfig = () => {
        const disabled = !applyForUsers(applyId, userRoles);
        const changeCompany = !!resumes.length || !!estimations.length;
        const onChangeCompanyHandler = (changeCompany && handleAddNoticeCompany)
            || handleModalShow;
        const isActive = !resumes.length
            && !estimations.length
            && !activities.length;

        const editItem = {
            icon: CreateIcon,
            text: translations.edit,
            handler: onChangeEdit,
            disabled,
        };
        const addTo1CItem = {
            icon: Icon1C,
            text: translations.addTo1C,
            handler: () => { setIsExportModalOpen(true); },
            disabled: disabled || isSaleExported,
            itemClass: classes.icon1C,
        };
        const replaceCompanyItem = {
            icon: SwapHoriz,
            text: translations.replaceCompany,
            handler: onChangeCompanyHandler,
            disabled: disabled || isArchiveStatus(status),
        };
        const deleteSaleItem = {
            icon: DeleteIcon,
            text: translations.deleteSale,
            disabled: disabled || !isActive,
            handler: () => setShowConfirmationDialog(true),
        };

        return with1C
            ? [editItem, addTo1CItem, replaceCompanyItem, deleteSaleItem]
            : [editItem, replaceCompanyItem, deleteSaleItem];
    };

    const handleSaveCompany = async (companyId: number) => {
        await updateCompanyHandler(saleId, companyId);
        await fetchContacts(companyId);

        handleModalShow();
        fetchActivities(saleId, 50, 0);
        fetchSale(saleId);
    };

    const deleteSale = async () => {
        await deleteSaleCard(saleId);

        history.push('/');
    };

    const switchExported = () => fetchSale(saleId);

    return (
        <>
            <CRMDotMenu
                className={classes.menuButton}
                config={getDotMenuConfig()}
            />
            {with1C && <AddSaleModal
                open={isExportModalOpen}
                onHandleOpenModal={() => setIsExportModalOpen(false)}
                switchExported={switchExported}
            />}
            <ReplaceCompanyModal
                open={replaceCompanyModalOpen}
                classes={classes}
                onClose={handleModalShow}
                saveCompany={handleSaveCompany}
            />
            <CancelConfirmation
                showConfirmationDialog={showConfirmationDialog}
                onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
                onConfirm={deleteSale}
                text={translations.notificationSaleDelete}
            />
        </>
    );
};

export default withRouter(HeaderWithModal);
