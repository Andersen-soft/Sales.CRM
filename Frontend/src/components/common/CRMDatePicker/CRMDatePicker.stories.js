import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import CRMDatePicker from './CRMDatePicker';

const DateDemo = ({ title, initDate, ...rest }) => {
    const [date, setDate] = useState(initDate);

    const handleChange = newDate => setDate(newDate);

    return (
        <>
            <h2>{title}</h2>
            <CRMDatePicker
                date={date}
                onChange={handleChange}
                {...rest}
            />
        </>
    );
};

storiesOf('Data pickers', module)
    .add('Data pickers', () => (
        <div>
            <DateDemo title='без дат, по умолчанию' theme='inline' initDate={null} />
            <DateDemo
                title='без дат, по умолчанию' theme='inline'
                initDate={null}
            />
            <DateDemo title='сегодня -- не выбрано' initDate={new Date()} />
            <DateDemo
                title='е выбранно -- сегодня' initDate={new Date()}
                maxDate={new Date()}
            />
        </div>
    ));
