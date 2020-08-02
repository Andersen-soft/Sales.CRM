// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { MAJOR_PRIORITET, CRITICAL_PRIORITET } from 'crm-constants/resumeRequestPage/resumeRequestCardConstants';
import type { StyledComponentProps } from '@material-ui/core/es';

import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import ResumePriorityDesktop from './ResumePriorityDesktop';
import ResumePriorityMobile from './ResumePriorityMobile';

type Props = {
    priority?: string,
    updateRequest: (fieldName: string, updateData: string | number) => boolean | Promise<boolean>,
} & StyledComponentProps;

const priorities = [
    { title: MAJOR_PRIORITET, value: MAJOR_PRIORITET },
    { title: CRITICAL_PRIORITET, value: CRITICAL_PRIORITET },
];

const ResumePriority = ({
    classes,
    priority,
    updateRequest,
}: Props) => {
    const translations = {
        priority: useTranslation('requestForCv.requestSection.priority'),
    };

    const handleChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) =>
        updateRequest('priority', value);

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumePriorityMobile : ResumePriorityDesktop;

    return (
        <SectionLayout
            translatePriority={translations.priority}
            priority={priority}
            handleChange={handleChange}
            priorities={priorities}
        />
    );
};

export default ResumePriority;
