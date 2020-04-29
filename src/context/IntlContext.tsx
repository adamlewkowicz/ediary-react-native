import React, { useState, ReactNode, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { INTL, Intl } from '../common/intl';
import { Language } from '../types';

export const IntlContext = React.createContext<Intl | null>(null);

interface IntlProviderProps {
  children: ReactNode
  initialLanguage: Language
}

export const IntlProvider = (props: IntlProviderProps) => {
  const [language] = useState<Language>(props.initialLanguage);

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