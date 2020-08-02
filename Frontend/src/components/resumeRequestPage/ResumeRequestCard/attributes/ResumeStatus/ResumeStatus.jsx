// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import {
    NAME_NEED,
    HR_NEED,
    IN_PROGRESS,
    CTO_NEED,
    DONE,
    PENDING,
} from 'crm-constants/resumeRequestPage/resumeRequestCardConstants';
import Notification from 'crm-components/notification/NotificationSingleton';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeStatusDesktop from './ResumeStatusDesktop';
import ResumeStatusMobile from './ResumeStatusMobile';

type ResponsibleType = {
    firstName: string,
    id: number,
    lastName: string,
}

type Props = {
    resumeId: number,
    status?: string,
    responsible?: ResponsibleType,
    updateRequest: (fieldName: string, updateData: string | number) => boolean | Promise<boolean>,
    getResumes: (number, ?number, ?number) => void,
} & StyledComponentProps

const statuses = [
    { title: NAME_NEED, value: NAME_NEED },
    { title: HR_NEED, value: HR_NEED },
    { title: IN_PROGRESS, value: IN_PROGRESS },
    { title: CTO_NEED, value: CTO_NEED },
    { title: DONE, value: DONE },
    { title: PENDING, value: PENDING },
];

const ResumeStatus = ({
    resumeId,
    updateRequest,
    getResumes,
    responsible,
    classes,
    status,
}: Props) => {
    const translations = {
        requestStatus: useTranslation('requestForCv.requestSection.requestStatus'),
        notificationChangeStatus: useTranslation('requestForCv.requestSection.notificationChangeStatus'),
    };

    const checkDisable = (newStatus: string) => {
        if (newStatus === PENDING && !responsible) {
            return false;
        }

        return !responsible;
    };

    const handleChange = async ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (checkDisable(value)) {
            Notification.showMessage({
                message: translations.notificationChangeStatus,
                closeTimeout: 15000,
            });
            return;
        }

        const result = await updateRequest('status', value);

        result && value === 'Done' && getResumes(resumeId);
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeStatusMobile : ResumeStatusDesktop;

    return (
        <SectionLayout
            translateStatus={translations.requestStatus}
            status={status}
            handleChange={handleChange}
            statuses={statuses}
        />
    );
};

export default ResumeStatus;
