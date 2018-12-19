export function emit(type, payload) {
  const event = new CustomEvent(`kuokko:${type}`, {detail: payload});
  document.dispatchEvent(event);
};
