import * as rx from 'rxjs';
import * as rxop from 'rxjs/operators';

const stream = new rx.BehaviorSubject();

export function emit(type, payload) {
  stream.next({type, payload});
};

export function subscribe(type, cb) {
  const sub = stream.pipe(
    rxop.filter((o) => o.type === type)
  ).subscribe(cb);

  return () => {
    sub.unsubscribe();
  };
}
