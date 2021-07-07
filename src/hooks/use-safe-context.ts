import { Context, useContext } from 'react';
import * as Utils from '../utils';
import { ContextProviderError } from '../common/error';

export const useSafeContext = <T>(context: Context<T | null>, displayName?: string): T => {
  const contextValue = useContext(context);

  if (Utils.isNil(contextValue)) {
    throw new ContextProviderError(
      `Context provider for "${displayName ?? context.displayName}" has not been passed.`
    );
  }
  
  return contextValue;
}