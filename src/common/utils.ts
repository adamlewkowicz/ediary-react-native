let timeout: NodeJS.Timeout;

export const debounce = (fn: () => void, delay = 150) => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}