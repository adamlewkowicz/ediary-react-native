let timeout: NodeJS.Timeout;

export const debounce = (fn: () => void, delay = 150) => {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}

export const round = (value: number, scale = 10) => Math.round(value / scale) * scale;