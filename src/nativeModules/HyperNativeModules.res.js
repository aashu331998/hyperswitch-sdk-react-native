// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_dict from "rescript/lib/es6/js_dict.js";
import * as Js_json from "rescript/lib/es6/js_json.js";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";
import * as ReactNative from "react-native";

var hyperswitchDict = Belt_Option.getWithDefault(Belt_Option.flatMap(Js_dict.get(ReactNative.NativeModules, "HyperModule"), Js_json.decodeObject), {});

console.log("hyperswitch dict------>", hyperswitchDict);

function getJsonFunWithCallbackFromKey(key) {
  var json = Js_dict.get(hyperswitchDict, key);
  if (json !== undefined) {
    return json;
  } else {
    return function (param, param$1) {
      console.log("flow here-");
    };
  }
}

function getStrFunWithCallbackFromKey(key) {
  var json = hyperswitchDict[key];
  if (json !== undefined) {
    return json;
  } else {
    return function (param, param$1, param$2) {
      
    };
  }
}

var hyperswitch_initPaymentSession = getJsonFunWithCallbackFromKey("initPaymentSession");

var hyperswitch_presentPaymentSheet = getJsonFunWithCallbackFromKey("presentPaymentSheet");

var hyperswitch_getCustomerDefaultSavedPaymentMethodData = getJsonFunWithCallbackFromKey("getCustomerDefaultSavedPaymentMethodData");

var hyperswitch_getCustomerLastUsedPaymentMethodData = getJsonFunWithCallbackFromKey("getCustomerLastUsedPaymentMethodData");

var hyperswitch_getCustomerSavedPaymentMethodData = getJsonFunWithCallbackFromKey("getCustomerSavedPaymentMethodData");

var hyperswitch_confirmWithCustomerDefaultPaymentMethod = getStrFunWithCallbackFromKey("confirmWithCustomerDefaultPaymentMethod");

var hyperswitch_confirmWithCustomerLastUsedPaymentMethod = getStrFunWithCallbackFromKey("confirmWithCustomerLastUsedPaymentMethod");

var hyperswitch_confirmWithCustomerPaymentToken = getJsonFunWithCallbackFromKey("confirmWithCustomerPaymentToken");

var hyperswitch = {
  initPaymentSession: hyperswitch_initPaymentSession,
  presentPaymentSheet: hyperswitch_presentPaymentSheet,
  getCustomerDefaultSavedPaymentMethodData: hyperswitch_getCustomerDefaultSavedPaymentMethodData,
  getCustomerLastUsedPaymentMethodData: hyperswitch_getCustomerLastUsedPaymentMethodData,
  getCustomerSavedPaymentMethodData: hyperswitch_getCustomerSavedPaymentMethodData,
  confirmWithCustomerDefaultPaymentMethod: hyperswitch_confirmWithCustomerDefaultPaymentMethod,
  confirmWithCustomerLastUsedPaymentMethod: hyperswitch_confirmWithCustomerLastUsedPaymentMethod,
  confirmWithCustomerPaymentToken: hyperswitch_confirmWithCustomerPaymentToken
};

function initPaymentSession(requestObj, callback) {
  console.log("init payment Session Native module rn wrapper ");
  hyperswitch_initPaymentSession(requestObj, callback);
}

function presentPaymentSheet(requestObj, callback) {
  console.log("reaching here------", requestObj);
  hyperswitch_presentPaymentSheet(requestObj, callback);
}

function getCustomerDefaultSavedPaymentMethodData(requestObj, callback) {
  hyperswitch_getCustomerDefaultSavedPaymentMethodData(requestObj, callback);
}

function getCustomerLastUsedPaymentMethodData(requestObj, callback) {
  hyperswitch_getCustomerLastUsedPaymentMethodData(requestObj, callback);
}

function getCustomerSavedPaymentMethodData(requestObj, callback) {
  hyperswitch_getCustomerSavedPaymentMethodData(requestObj, callback);
}

function confirmWithCustomerDefaultPaymentMethod(requestObj, cvc, callback) {
  hyperswitch_confirmWithCustomerDefaultPaymentMethod(requestObj, cvc, callback);
}

function confirmWithCustomerLastUsedPaymentMethod(requestObj, cvc, callback) {
  hyperswitch_confirmWithCustomerLastUsedPaymentMethod(requestObj, cvc, callback);
}

export {
  hyperswitchDict ,
  getJsonFunWithCallbackFromKey ,
  getStrFunWithCallbackFromKey ,
  hyperswitch ,
  initPaymentSession ,
  presentPaymentSheet ,
  getCustomerDefaultSavedPaymentMethodData ,
  getCustomerLastUsedPaymentMethodData ,
  getCustomerSavedPaymentMethodData ,
  confirmWithCustomerDefaultPaymentMethod ,
  confirmWithCustomerLastUsedPaymentMethod ,
}
/* hyperswitchDict Not a pure module */
