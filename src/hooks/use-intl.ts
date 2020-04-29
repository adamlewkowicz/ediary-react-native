import { IntlContext } from '../context/IntlContext'
import { Intl } from '../common/intl';
import { useSafeContext } from './use-safe-context';

export const useIntl = (): Intl => useSafeContext(IntlContext, 'IntlContext');