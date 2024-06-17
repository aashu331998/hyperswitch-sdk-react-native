// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "react";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";
import * as Caml_option from "rescript/lib/es6/caml_option.js";
import * as HyperProvider from "../context/HyperProvider.res.js";
import * as HyperNativeModules from "../nativeModules/HyperNativeModules.res.js";

function useHyper() {
  var match = React.useContext(HyperProvider.hyperProviderContext);
  var hyperVal = match[0];
  return function () {
    var initPaymentSheet = function (initPaymentSheetParams) {
      console.log("hello world", hyperVal);
      var appearance = Belt_Option.getWithDefault(initPaymentSheetParams.configuration.appearance, {});
      return {
              configuration: Caml_option.some({
                    appearance: appearance,
                    googlePay: initPaymentSheetParams.configuration.googlePay,
                    customer: {
                      id: initPaymentSheetParams.customerId,
                      ephemeralKeySecret: initPaymentSheetParams.customerEphemeralKeySecret
                    }
                  }),
              publishableKey: hyperVal.publishableKey,
              clientSecret: initPaymentSheetParams.clientSecret,
              type: "payment",
              from: "rn"
            };
    };
    var presentPaymentSheet = function (paySheetParams) {
      console.log("present payment sheet called!!!!!!!");
      return new Promise((function (resolve, param) {
                    var responseResolve = function (arg) {
                      var val = JSON.parse(arg);
                      resolve(val);
                    };
                    HyperNativeModules.presentPaymentSheet(paySheetParams, responseResolve);
                  }));
    };
    var initHeadless = function (paySheetParams) {
      console.log("called at RN");
      HyperNativeModules.initHeadless(paySheetParams, (function (obj) {
              console.log("headless ok!!!!!", obj);
            }));
    };
    var paymentMethodParams = function () {
      console.log("hello world");
    };
    var getCustomerSavedPaymentMethodData = function (paySheetParams) {
      HyperNativeModules.getCustomerSavedPaymentMethodData(paySheetParams, (function (obj) {
              console.log("getCustomer", obj);
            }));
    };
    return {
            initPaymentSheet: initPaymentSheet,
            presentPaymentSheet: presentPaymentSheet,
            paymentMethodParams: paymentMethodParams,
            initHeadless: initHeadless,
            getCustomerSavedPaymentMethodData: getCustomerSavedPaymentMethodData
          };
  };
}

export {
  useHyper ,
}
/* react Not a pure module */