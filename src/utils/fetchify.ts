import { FetchifyError } from '../common/error';

export const fetchify = async <T>(
  input: RequestInfo,
  init: RequestInit = {},
  controller = new AbortController()
): Promise<T> => {
  const { signal } = controller;

  const response = await fetch(input, { signal, ...init });

  if (!response.ok) {
    throw new FetchifyError(response.statusText);
  }

  const json: T = await response.json();

  return json;
}