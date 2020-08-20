// @flow

import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'crm-hooks/useTranslation';
import { checkDisableDeleteButton } from 'crm-utils/ResumeRequest/ResumeRequestUtils';
import { pages } from 'crm-constants/navigation';
import type { StyledComponentProps } from '@material-ui/core/es';

import ResumeHeaderDesktop from './ResumeHeaderDesktop';

type Props = {
    resumeId: number,
    deleteResume: (number) => void,
    history: Object,
    userRoles: Array<string>,
    resumeTotalElements: number,
} & StyledComponentProps

const ResumeHeader = ({
    resumeId,
    userRoles,
    resumeTotalElements,
    deleteResume,
    history,
}: Props) => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const translations = {
        notificationDeleteCv: useTranslation('requestForCv.requestSection.notificationDeleteCv'),
    };

    const handleDeletePopoverOpen = () => setShowConfirmationDialog(true);

    const handleConfirmationDialogClose = () => setShowConfirmationDialog(false);

    const deleteRequest = async () => {
        try {
            await deleteResume(resumeId);
            handleConfirmationDialogClose();
            history.push(pages.RESUME_REQUESTS_ALL);
        } catch (err) {
            handleConfirmationDialogClose();
        }
    };

    return (
        <ResumeHeaderDesktop
            resumeId={resumeId}
            disableDeletedButton={checkDisableDeleteButton(userRoles, resumeTotalElements)}
            handleDeletePopoverOpen={handleDeletePopoverOpen}
            showConfirmationDialog={showConfirmationDialog}
            handleConfirmationDialogClose={handleConfirmationDialogClose}
            deleteRequest={deleteRequest}
            translateNotificationDeleteCv={translations.notificationDeleteCv}
        />
    );
};

export default withRouter(ResumeHeader);
