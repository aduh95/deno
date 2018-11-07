// Copyright 2018 the Deno authors. All rights reserved. MIT license.
import { Event } from "./event";

export interface EventListener {
  (evt: Event): void;
}

export interface EventListenerObject {
  handleEvent(evt: Event): void;
}

export type EventListenerOrEventListenerObject =
  | EventListener
  | EventListenerObject;

export interface EventListenerOptions {
  capture?: boolean;
}

export interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
}

export class EventTarget {
  public listeners: {
    [type in string]: EventListenerOrEventListenerObject[]
  } = {};

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    if (listener !== null) {
      this.listeners[type].push(listener);
    }
  }

  public removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void {
    if (type in this.listeners && callback !== null) {
      this.listeners[type] = this.listeners[type].filter(
        listener => listener !== callback
      );
    }
  }

  public dispatchEvent(event: Event): boolean {
    if (!(event.type in this.listeners)) {
      return true;
    }
    const stack = this.listeners[event.type].slice();

    for (const stackElement of stack) {
      if ((stackElement as EventListenerObject).handleEvent) {
        (stackElement as EventListenerObject).handleEvent(event);
      } else {
        (stackElement as EventListener).call(this, event);
      }
    }
    return !event.defaultPrevented;
  }
}
