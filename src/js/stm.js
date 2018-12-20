import {constant, isFunction, isUndefined, isArray} from "lodash";
import match from "minimatch";

export default class StateMachine {
  constructor() {
    this.steps = [];
    this.reg = {};
    this.state = {};
  }

  async start(subscription) {
    if (isUndefined(this.current)) {
      throw new Error("initial handler is not defined");
    }

    await this.current.onEnter();
    await this.current.handle()
    this.subscription = subscription;
  }

  async stop() {
    this.subscription.unsubscribe();
    this.state = {};
    this.steps = [];
    delete this.subscription;
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

  transitionTo(name) {
    setTimeout(() => {
      const handler = this.reg[name];
      return this.transitionToHandler(handler);
    }, 100);
  }

  async transitionToHandler(handler, data) {
    this.steps.push(handler.name);

    if (handler.hidden) {
      await handler.handle(data);
    } else {
      if (this.current.name === handler.name) {
        await handler.handle(data);
      } else {
        await this.current.onLeave(handler);
        await handler.onEnter(data);
        await handler.handle(data);
        this.current = handler;
      }
    }
  }

  add(name, {handler, choices, global=false, hidden=false}) {
    handler = isFunction(handler) ? handler() : handler;

    const _handler = {
      name: name,
      hidden: hidden,
      global: global,

      match: handler.match.bind(this),
      handle: handler.handle.bind(this)
    }

    if (isArray(choices)) {
      _handler.choices = choices.map(match.makeRe);
    }

    if (isFunction(handler.onEnter)) {
      _handler.onEnter = handler.onEnter.bind(this);
    } else {
      _handler.onEnter = constant(null);
    }

    if (isFunction(handler.onLeave)) {
      _handler.onLeave = handler.onLeave.bind(this);
    } else {
      _handler.onLeave = constant(null);
    }

    this.reg[name] = _handler;

    if (name === "") {
      this.current = _handler;
    }
  }

  getHandlersForState(name) {
    const result = [];
    const handler = this.reg[name];

    if (isUndefined(handler)) {
      return result;
    }

    const choices = handler.choices;

    if (!isArray(choices)) {
      return result;
    }

    for (let opt of choices) {
      for (let name of Object.keys(this.reg)) {
        if (opt.test(name)) {
          result.push(this.reg[name]);
        }
      }
    }

    for (let item of Object.values(this.reg)) {
      if (item.global) {
        result.push(item);
      }
    }

    return result;
  }

  get handlers() {
    const name = this.current.name;
    return this.getHandlersForState(name);
  }
}

