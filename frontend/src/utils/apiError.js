export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean);
    if (messages.length) return messages.join('; ');
  }
  if (detail && typeof detail.message === 'string') return detail.message;
  return fallback;
};

export default getApiErrorMessage;
