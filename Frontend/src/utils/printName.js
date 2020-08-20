// @flow

import type { Person } from 'crm-types/allResumeRequests';

export const printName = ({ firstName, lastName }: Person) => `${firstName} ${lastName}`.trim();
