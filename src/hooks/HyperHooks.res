external parser: HyperTypes.sendingToOrca => Js.Json.t = "%identity"
type useHyperReturnType = {
  initPaymentSheet: HyperTypes.initPaymentSheetParamTypes => HyperTypes.sendingToOrca,
  presentPaymentSheet: HyperTypes.sendingToOrca => promise<HyperTypes.responseFromNativeModule>,
  paymentMethodParams: unit => unit,
  initHeadless: HyperTypes.sendingToOrca => unit,
  getCustomerSavedPaymentMethodData: HyperTypes.sendingToOrca => unit,
}

let useHyper = () => {
  let (hyperVal, _) = React.useContext(HyperProvider.hyperProviderContext)

  () => {
    let initPaymentSheet = (initPaymentSheetParams: HyperTypes.initPaymentSheetParamTypes) => {
      Console.log2("hello world", hyperVal)
      let appearance =
        initPaymentSheetParams.configuration.appearance->Belt.Option.getWithDefault({})

      let x: HyperTypes.sendingToOrca = {
        configuration: Some({
          appearance,
          googlePay: ?initPaymentSheetParams.configuration.googlePay,
          customer: {
            id: initPaymentSheetParams.customerId,
            ephemeralKeySecret: initPaymentSheetParams.customerEphemeralKeySecret,
          },
        }),
        publishableKey: hyperVal.publishableKey,
        clientSecret: initPaymentSheetParams.clientSecret,
        \"type": "payment",
        from: "rn",
        // branding: initPaymentSheetParams.branding,
        // locale: initPaymentSheetParams.locale,
      }
      x
    }

    let presentPaymentSheet = (paySheetParams: HyperTypes.sendingToOrca) => {
      Console.log("present payment sheet called!!!!!!!")
      let paySheetParamsJson = paySheetParams->parser

      Js.Promise.make((~resolve: HyperTypes.responseFromNativeModule => unit, ~reject as _) => {
        let responseResolve = arg => {
          // Console.log(arg)
          let val = arg->HyperTypes.parseResponse
          resolve(val)
        }
        HyperNativeModules.presentPaymentSheet(paySheetParamsJson, responseResolve)
      })
    }

    let initHeadless = (paySheetParams: HyperTypes.sendingToOrca) => {
      let paySheetParamsJson = paySheetParams->parser
      Console.log("called at RN")
      HyperNativeModules.initHeadless(paySheetParamsJson, obj => {
        Console.log2("headless ok!!!!!", obj)
      })
    }
    let paymentMethodParams = () => {
      Console.log("hello world")
    }

    let getCustomerSavedPaymentMethodData = (paySheetParams: HyperTypes.sendingToOrca) => {
      let paySheetParamsJson = paySheetParams->parser
      HyperNativeModules.getCustomerSavedPaymentMethodData(paySheetParamsJson, obj => {
        Console.log2("getCustomer", obj)
      })
    }
    {
      initPaymentSheet,
      presentPaymentSheet,
      paymentMethodParams,
      initHeadless,
      getCustomerSavedPaymentMethodData,
    }
  }
}