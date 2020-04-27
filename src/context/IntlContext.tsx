import React, { useState, ReactNode, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { INTL, Intl } from '../common/intl';

export const IntlContext = React.createContext<Intl | null>(null);

interface IntlProviderProps {
  children: ReactNode
}

export const IntlProvider = (props: IntlProviderProps) => {
  const [language] = useState<'pl'>('pl');

  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  const intl = useMemo(() => INTL[language], [language]);

  return (
    <IntlContext.Provider value={intl}>
      {props.children}
    </IntlContext.Provider>
  );
}