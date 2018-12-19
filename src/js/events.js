export function emit(type, payload) {
  const event = new CustomEvent(type, {detail: payload});
  document.dispatchEvent(event);
};
