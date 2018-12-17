import {constant, isFunction, isUndefined, isPlainObject, isArray, pick} from "lodash-es";

export class StateMachine {
  constructor(spec) {
    this.spec = spec;

    this.reg = {};
  }

  async start() {
    if (isUndefined(this.current)) {
      throw new Error("initial handler is not defined");
    }

    await this.current.onEnter();
    await this.current.handle();
  }

  async matches(data) {
    for (let handler of this.handlers) {
      const matches = await handler.match(data);
      if (matches) {
        return handler;
      }
    }

    return null;
  }

  async transitionToHandler(handler) {
    await this.currentHandler.onLeave();
    await handler.onEnter();
    await handler.handle(name);
    this.currentHandler = currentHandler;
    this.current = handle.name;
  }

  add(name, opts) {
    if (isFunction(opts)) {
      this.add(name, opts());
    } else if (isPlainObject(opts)) {

      const result = {
        name: name,
        match: opts.match.bind(this),
        handle: opts.handle.bind(this)
      };

      if (isFunction(opts.onEnter)) {
        result.onEnter.bind(this);
      } else {
        result.onEnter = constant(null);
      }

      if (isFunction(opts.onLeave)) {
        result.onLeave.bind(this);
      } else {
        result.onLeave = constant(null);
      }

      this.reg[name] = result;

      if (name === "") {
        this.current = result;
      }
    } else {
      throw new Error("invalid opts");
    }
  }

  get handlers() {
    const availableOptions = this.spec[this.current];
    if (isArray(availableOptions)) {
      return Object.values(pick(this.reg, availableOptions));
    } else {
      return [];
    }
  }
}

