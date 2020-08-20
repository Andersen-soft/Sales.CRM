// @flow

import React, { useState, useEffect } from 'react';
import { path } from 'ramda';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import Notification from 'crm-components/notification/NotificationSingleton';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';
import MobilePageLayout from './MobilePageLayout';
import DesktopPageLayout from './DesktopPageLayout';

import type { Router } from 'react-router-dom';
import type {
    resumeRequestCardPropsType,
    resumeTablePropsType,
    ResumeRequestActions,
    ResumeRequest,
} from 'crm-containers/ResumeRequestPage/ResumeRequestPage';

type Props = {
    resumeRequestCardProps: resumeRequestCardPropsType,
    resumeTableProps: resumeTablePropsType,
    routeParams: { resumeId: string },
    history: Router,
    fetchResumeRequest: (number | string) => Promise<ResumeRequest>,
} & ResumeRequestActions;

const ResumeRequestPage = ({
    resumeRequestCardProps,
    resumeTableProps,
    fetchResumeRequest,
    updateResumeRequest,
    deleteResumeRequest,
    fetchResume,
    updateResume,
    addAttachment,
    deleteAttachment,
    deleteResume,
    createResume,
    routeParams: { resumeId },
    history,
}:Props) => {
    const [correctUrl, setCorrectUrlData] = useState(false);

    const translations = {
        notificationNotExistStart: useTranslation('requestForCv.notifications.notificationNotExistStart'),
        notificationNotExistEnd: useTranslation('requestForCv.notifications.notificationNotExistEnd'),
    };

    const isMobile = useMobile();

    useEffect(() => {
        fetchResumeRequest(resumeId)
            .then(({ id, name }) => {
                document.title = `${id} - ${name}`;
                setCorrectUrlData(true);
            })
            .catch(error => {
                if (path(['response', 'status'], error) !== 401) {
                    Notification.showMessage({
                        message: `${translations.notificationNotExistStart} ${resumeId} ${translations.notificationNotExistEnd}`,
                        type: 'warning',
                        closeTimeout: 15000,
                    });
                    history.push(pages.RESUME_REQUESTS_ALL);
                }
            });
    }, [resumeId]);

    const PageLayout = isMobile ? MobilePageLayout : DesktopPageLayout;

    return correctUrl && <PageLayout
        key={resumeId}
        requestId={resumeId}
        resumeRequestCardProps={resumeRequestCardProps}
        resumeTableProps={resumeTableProps}
        fetchResumeRequest={fetchResumeRequest}
        updateResumeRequest={updateResumeRequest}
        deleteResumeRequest={deleteResumeRequest}
        fetchResume={fetchResume}
        updateResume={updateResume}
        addAttachment={addAttachment}
        deleteAttachment={deleteAttachment}
        deleteResume={deleteResume}
        createResume={createResume}
    />;
};

export default ResumeRequestPage;
