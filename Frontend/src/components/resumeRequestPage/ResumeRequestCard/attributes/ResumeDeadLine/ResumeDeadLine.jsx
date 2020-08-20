// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeDeadLineDesktop from './ResumeDeadLineDesktop';
import ResumeDeadLineMobile from './ResumeDeadLineMobile';

type Props = {
    deadLine?: string,
    updateRequest: (fieldName: string, updateData: string | number) => boolean | Promise<boolean>,
} & StyledComponentProps

const ResumeDeadLine = ({
    classes,
    updateRequest,
    deadLine,
}: Props) => {
    const translations = {
        deadline: useTranslation('requestForCv.requestSection.deadline'),
    };

    const handleDateChange = date => {
        if (date) {
            updateRequest('deadLine', getDate(date, FULL_DATE_DS));
        }
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeDeadLineMobile : ResumeDeadLineDesktop;

    return (
        <SectionLayout
            translateDeadline={translations.deadline}
            deadLine={deadLine}
            handleDateChange={handleDateChange}
        />
    );
};

export default ResumeDeadLine;
