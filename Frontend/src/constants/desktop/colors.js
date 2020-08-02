import {
    orange, grey, blueGrey, green, blue, pink, red,
} from '@material-ui/core/colors';
import { statusColors } from 'crm-constants/jss/colors';

export const ALL = grey[800];
export const LEAD = blue[800];
export const PRELEAD = orange[800];
export const IN_WORK = green[800];
export const OPPORTUNITY = pink[900];
export const CONTRACT = red[800];
export const ARCHIVE = blueGrey[800];
export const UNSELECTED = grey[600];
export const ALL_BACKGROUND = grey[200];

export const statusesBackgrounds = {
    preLead: {
        backgroundColor: statusColors.PRELEAD,
    },
    lead: {
        backgroundColor: statusColors.LEAD,
    },
    all: {
        backgroundColor: ALL_BACKGROUND,
    },
    inWork: {
        backgroundColor: statusColors.IN_WORK,
    },
    opportunity: {
        backgroundColor: statusColors.OPPORTUNITY,
    },
    contract: {
        backgroundColor: statusColors.CONTRACT,
    },
};
