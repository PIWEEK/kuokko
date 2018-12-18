import {constant, isFunction, isUndefined, isPlainObject, isArray, pick} from "lodash";

export default class StateMachine {
  constructor(spec) {
    this.spec = spec;
    this.reg = {};
    this.state = {};
  }

  async start() {
    if (isUndefined(this.current)) {
      throw new Error("initial handler is not defined");
    }

    await this.current.onEnter();
    await this.current.handle()
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

  async transitionToHandler(handler, data) {
    // TODO: check handler type
    if (this.current.name === handler.name) {
      await handler.handle(data);
    } else {
      await this.current.onLeave(handler);
      await handler.onEnter(data);
      await handler.handle(data);
      this.current = handler;
    }
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
        result.onEnter = opts.onEnter.bind(this);
      } else {
        result.onEnter = constant(null);
      }

      if (isFunction(opts.onLeave)) {
        result.onLeave = opts.onLeave.bind(this);
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
    const availableOptions = this.spec[this.current.name];
    if (isArray(availableOptions)) {
      return Object.values(pick(this.reg, availableOptions));
    } else {
      return [];
    }
  }
}

