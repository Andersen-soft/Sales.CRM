// @flow
import { pathOr } from 'ramda';

import type { AvailableHR } from './types';

const SERVER_REQUEST_FAIL_MESSAGE = 'Ошибка сервера';

const namesToPrintName = (firstName: ?string, lastName: ?string) => `${firstName || ''} ${lastName || ''}`.trim();

export const employeeRespEntityToAvaliableHr = (
    employee: Object
): AvailableHR => ({
    id: employee.id,
    printName: namesToPrintName(employee.firstName, employee.lastName),
});

export const getMessageFromError = (error: Object) => pathOr(SERVER_REQUEST_FAIL_MESSAGE, [
    'response',
    'data',
    'errorMessage',
], error);
