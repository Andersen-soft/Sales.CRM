// @flow

import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';

type Props = {
    values: string,
    isEdit: boolean,
    updateEditRowState: (key: string, value: ?Date) => void,
};

const BirthdayCell = ({
    values: dateOfBirth,
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localDateOfBirth, setLocalDateOfBirth] = useState(dateOfBirth);

    const changeBirthday = (date: ?Date) => {
        setLocalDateOfBirth(date);
        updateEditRowState('dateOfBirth', date);
    };

    return (
        <Grid>
            {isEdit
                ? <Grid item>
                    <CRMDatePicker
                        date={localDateOfBirth ? new Date(localDateOfBirth) : null}
                        onChange={changeBirthday}
                        maxDate={new Date()}
                        clearable
                        showMonthAndYearPickers
                    />
                </Grid>
                : <Grid
                    container
                    item
                >
                    {localDateOfBirth ? getDate(localDateOfBirth, FULL_DATE_CS) : <CRMEmptyBlock />}
                </Grid>
            }
        </Grid>
    );
};

export default BirthdayCell;
