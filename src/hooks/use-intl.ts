import { useContext } from 'react'
import { IntlContext } from '../context/IntlContext'
import { Intl } from '../common/intl';

export const useIntl = (): Intl => {
  const intl = useContext(IntlContext);

  if (intl === null) {
    throw new Error(
      'Intl provider has not been rendered.'
    );
  }

  return intl;
}