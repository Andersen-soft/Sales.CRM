// @flow

import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Notification from 'crm-components/notification/NotificationSingleton';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useTranslation } from 'crm-hooks/useTranslation';

import ResumeModal from './ResumeModal';

import { type NewResume } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { StyledComponentProps } from '@material-ui/core/es';

type Props = {
    requestResumeId: number,
    createResume: (number, NewResume) => void,
    responsibleRmId: ?number,
    setUpdateHistory: (boolean) => void,
} & StyledComponentProps

const HeaderWithModal = ({
    responsibleRmId,
    classes,
    requestResumeId,
    createResume,
    setUpdateHistory,
}: Props) => {
    const [modalIsShowed, setmodalIsShowed] = useState(false);

    const translations = {
        cv: useTranslation('requestForCv.cvSection.cv'),
        add: useTranslation('common.add'),
        addApplicant: useTranslation('requestForCv.cvSection.addApplicant'),
        applicantCanNotAdded: useTranslation('requestForCv.cvSection.applicantCanNotAdded'),
    };

    const handleModalShow = () => {
        if (!responsibleRmId) {
            Notification.showMessage({
                message: translations.applicantCanNotAdded,
                closeTimeout: 15000,
            });
            return;
        }

        setmodalIsShowed(!modalIsShowed);
    };

    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12}
            className={classes.headerWrapper}
        >
            <ResumeModal
                open={modalIsShowed}
                requestResumeId={requestResumeId}
                onModalToggle={handleModalShow}
                createResume={createResume}
                setUpdateHistory={setUpdateHistory}
            />
            <Grid
                item
                className={classes.headerTitle}
            >
                {translations.cv}
            </Grid>
            <Grid
                item
                className={classes.addApplicant}
            >
                <CRMButton
                    grey
                    component='span'
                    onClick={handleModalShow}
                >
                    {translations.add}
                    <Add fontSize='small' />
                </CRMButton>
            </Grid>
        </Grid>
    );
};

export default HeaderWithModal;
