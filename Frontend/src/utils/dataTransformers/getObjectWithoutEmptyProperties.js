import { complement, isNil, pickBy } from 'ramda';

export default parameters => pickBy(complement(isNil), parameters);
