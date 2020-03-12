import React, { RefObject } from 'react';

interface ComponentProps {
  forwardedRef: RefObject<unknown>
  ref: RefObject<unknown>
}

export function forwadRef<T>(Component: T): T {
  return React.forwardRef(
    (props, ref) => <Component {...props} forwadedRef={ref as any} />
  ) as any;
}