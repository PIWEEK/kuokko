import * as rx from 'rxjs';

const bus = new rx.BehaviorSubject();

export default bus;

export function emit(type, payload) {
  bus.next({type, payload});
};
