import React, { useRef } from 'react'

export const useRefs = <T>(length: number) => {
  const refs = useRef(
    Array
      .from({ length }, () => React.createRef<T>())
      // .map(() => React.createRef())
  );

  return refs.current;
}