// @flow

import React from 'react';
import CRMIcon from 'crm-ui/CRMIcons';
import MaleImg from 'crm-static/customIcons/male.svg';
import FemaleImg from 'crm-static/customIcons/female.svg';

import { FEMALE_KEY, MALE_KEY } from 'crm-constants/gender';

const GENDER_FIELD = {
    [MALE_KEY]: MaleImg,
    [FEMALE_KEY]: FemaleImg,
};

type Props = {
    values: string,
};

const GenderCell = ({
    values: genderKey,
}: Props) => <CRMIcon IconComponent={GENDER_FIELD[genderKey]} />;

export default GenderCell;
