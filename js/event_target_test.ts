// Copyright 2018 the Deno authors. All rights reserved. MIT license.
import { test, assert, assertEqual } from "./test_util";

test(function addEventListenerTest() {
  assertEqual(document.addEventListener("x", null, false), undefined);
  assertEqual(document.addEventListener("x", null, true), undefined);
  assertEqual(document.addEventListener("x", null), undefined);
});

test(function constructedEventTargetCanBeUsedAsExpected() {
    const target = new EventTarget();
    const event = new Event("foo", { bubbles: true, cancelable: false });
    let callCount = 0;
  
    function listener(e) {
      assertEqual(e, event);
      ++callCount;
    }
  
    target.addEventListener("foo", listener);
  
    target.dispatchEvent(event);
    assertEqual(callCount, 1);
  
    target.dispatchEvent(event);
    assertEqual(callCount, 2);
  
    target.removeEventListener("foo", listener);
    target.dispatchEvent(event);
    assertEqual(callCount, 2);
  });
  
  test(function anEventTargetCanBeSubclassed() {
    class NicerEventTarget extends EventTarget {
      on(type, listener?, options?) {
        this.addEventListener(type, listener, options);
      }
  
      off(type, callback?, options?) {
        this.removeEventListener(type, callback, options);
      }
  
      dispatch(type, detail) {
        this.dispatchEvent(new CustomEvent(type, { detail }));
      }
    }
  
    const target = new NicerEventTarget();
    const event = new Event("foo", { bubbles: true, cancelable: false });
    const detail = "some data";
    let callCount = 0;
  
    function listener(e) {
      assertEqual(e.detail, detail);
      ++callCount;
    }
  
    target.on("foo", listener);
  
    target.dispatch("foo", detail);
    assertEqual(callCount, 1);
  
    target.dispatch("foo", detail);
    assertEqual(callCount, 2);
  
    target.off("foo", listener);
    target.dispatch("foo", detail);
    assertEqual(callCount, 2);
  });

  test(function dispatchEventReturnValueAffectedByPreventDefault() {
    var event_type = "foo";
    var target = document.getElementById("target");
    var parent = document.getElementById("parent");
    var default_prevented;
    var return_value;
    parent.addEventListener(event_type, function(e) {}, true);
    target.addEventListener(event_type, function(e) {
        evt.preventDefault();
        default_prevented = evt.defaultPrevented;
        return_value = evt.returnValue;
    }, true);
    target.addEventListener(event_type, function(e) {}, true);
    var evt = document.createEvent("Event");
    evt.initEvent(event_type, true, true);
    assert(parent.dispatchEvent(evt));
    assert(!target.dispatchEvent(evt));
    assert(default_prevented);
    assert(!return_value);
});

test(function dispatchEventReturnValueAffectedByReturnValueProperty() {
    var event_type = "foo";
    var target = document.getElementById("target");
    var parent = document.getElementById("parent");
    var default_prevented;
    var return_value;
    parent.addEventListener(event_type, function(e) {}, true);
    target.addEventListener(event_type, function(e) {
        evt.returnValue = false;
        default_prevented = evt.defaultPrevented;
        return_value = evt.returnValue;
    }, true);
    target.addEventListener(event_type, function(e) {}, true);
    var evt = document.createEvent("Event");
    evt.initEvent(event_type, true, true);
    assert(parent.dispatchEvent(evt));
    assert(!target.dispatchEvent(evt));
    assert(default_prevented);
    assert(!return_value);
});

test(function removingNullEventListenerShouldSucceed() {
    assertEqual(document.removeEventListener("x", null, false), undefined);
    assertEqual(document.removeEventListener("x", null, true), undefined);
    assertEqual(document.removeEventListener("x", null), undefined);
  });