// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "react";
import * as Js_dict from "rescript/lib/es6/js_dict.js";
import * as Caml_option from "rescript/lib/es6/caml_option.js";
import * as Core__Option from "@rescript/core/src/Core__Option.res.js";
import * as HyperProvider from "../context/HyperProvider.res.js";
import * as HyperNativeModules from "../nativeModules/HyperNativeModules.res.js";

function useHyper() {
  var match = React.useContext(HyperProvider.hyperProviderContext);
  var hyperVal = match[0];
  var registerHeadless = function (paySheetParams) {
    console.log("Flow here------------>");
    HyperNativeModules.registerHeadless(paySheetParams, (function (obj) {
            console.log("called>>>>>>>.");
          }));
  };
  var initPaymentSession = function (initPaymentSheetParams) {
    return {
            configuration: Core__Option.getOr(initPaymentSheetParams.configuration, {}),
            customBackendUrl: Caml_option.some(hyperVal.customBackendUrl),
            publishableKey: hyperVal.publishableKey,
            clientSecret: initPaymentSheetParams.clientSecret,
            type: "payment",
            from: "rn"
          };
  };
  var presentPaymentSheet = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    var val = JSON.parse(arg);
                    resolve(val);
                  };
                  HyperNativeModules.presentPaymentSheet(paySheetParams, responseResolve);
                }));
  };
  var getCustomerDefaultSavedPaymentMethodData = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    resolve(arg);
                  };
                  HyperNativeModules.getCustomerDefaultSavedPaymentMethodData(paySheetParams, responseResolve);
                }));
  };
  var getCustomerLastUsedPaymentMethodData = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    resolve(arg);
                  };
                  HyperNativeModules.getCustomerLastUsedPaymentMethodData(paySheetParams, responseResolve);
                }));
  };
  var getCustomerSavedPaymentMethodData = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    console.log(arg);
                    var x = Js_dict.get(arg, "paymentMethods");
                    console.log("val-------", x);
                    resolve(x);
                  };
                  HyperNativeModules.getCustomerSavedPaymentMethodData(paySheetParams, responseResolve);
                }));
  };
  var confirmWithCustomerDefaultPaymentMethod = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    console.log(arg);
                    resolve(arg);
                  };
                  HyperNativeModules.confirmWithCustomerDefaultPaymentMethod(paySheetParams, responseResolve);
                }));
  };
  var confirmWithCustomerLastUsedPaymentMethod = function (paySheetParams) {
    return new Promise((function (resolve, param) {
                  var responseResolve = function (arg) {
                    console.log(arg);
                    resolve(arg);
                  };
                  HyperNativeModules.confirmWithCustomerLastUsedPaymentMethod(paySheetParams, responseResolve);
                }));
  };
  return {
          initPaymentSession: initPaymentSession,
          presentPaymentSheet: presentPaymentSheet,
          registerHeadless: registerHeadless,
          getCustomerDefaultSavedPaymentMethodData: getCustomerDefaultSavedPaymentMethodData,
          getCustomerLastUsedPaymentMethodData: getCustomerLastUsedPaymentMethodData,
          getCustomerSavedPaymentMethodData: getCustomerSavedPaymentMethodData,
          confirmWithCustomerDefaultPaymentMethod: confirmWithCustomerDefaultPaymentMethod,
          confirmWithCustomerLastUsedPaymentMethod: confirmWithCustomerLastUsedPaymentMethod
        };
}

export {
  useHyper ,
}
/* react Not a pure module */
