import * as rx from 'rxjs';

const bus = new rx.BehaviorSubject();

export function emit(type, payload) {
  bus.next({type, payload});
};

export default bus;
