public class PaymentSession {
    internal static var publishableKey: String?
    internal static var customBackendUrl: String?
    internal static var paymentIntentClientSecret: String?
    internal static var headlessCompletion: ((PaymentSessionHandler) -> Void)?
    private static var completion: ((PaymentResult) -> Void)?
    private static var hasResponded: Bool = false
    internal static var isPresented: Bool = false
    
    public init(publishableKey: String, customBackendUrl: String? = nil, customParams: [String : Any]? = nil, customLogUrl: String? = nil){
        PaymentSession.publishableKey = publishableKey
        PaymentSession.customBackendUrl = customBackendUrl
    }
    
    public func initPaymentSession(paymentIntentClientSecret: String) {
        PaymentSession.paymentIntentClientSecret = paymentIntentClientSecret
    }
    
    public func getCustomerSavedPaymentMethods(_ func_: @escaping (PaymentSessionHandler) -> Void) {
        PaymentSession.hasResponded = false
        PaymentSession.isPresented = false
        PaymentSession.headlessCompletion = func_
        
        RNViewManager.sharedInstance2.reinvalidateBridge()
        let _ = RNViewManager.sharedInstance2.viewForModule("dummy", initialProperties: [:])
    }
    
    internal static func getPaymentSession(getPaymentMethodData: NSDictionary, getPaymentMethodData2: NSDictionary, getPaymentMethodDataArray: NSArray, callback: @escaping RCTResponseSenderBlock) {
        DispatchQueue.main.async {
            PaymentSession.hasResponded = false
            let handler = PaymentSessionHandler(
                getCustomerDefaultSavedPaymentMethodData: {
                    return parseGetPaymentMethodData(getPaymentMethodData)
                },
                getCustomerLastUsedPaymentMethodData: {
                    return parseGetPaymentMethodData(getPaymentMethodData2)
                },
                getCustomerSavedPaymentMethodData: {
                    var array = [PaymentMethod]()
                    for i in 0..<getPaymentMethodDataArray.count {
                        if let map = getPaymentMethodDataArray[i] as? NSDictionary {
                            array.append(parseGetPaymentMethodData(map))
                        }
                    }
                    return array
                },
                confirmWithCustomerDefaultPaymentMethod: { cvc, resultHandler in
                    if let map = getPaymentMethodData["_0"] as? NSDictionary,
                       let paymentToken = map["payment_token"] as? String {
                        self.completion = resultHandler
                        var map = [String: Any]()
                        map["paymentToken"] = paymentToken
                        map["cvc"] = cvc
                        self.safeResolve(callback, map, resultHandler)
                    }
                    else {
                        PaymentSession.hasResponded = true
                        let error = NSError(domain: "NotInitialised", code: 0, userInfo: [NSLocalizedDescriptionKey: "Not Initialised"])
                        resultHandler(.failed(error: error))
                    }
                },
                confirmWithCustomerLastUsedPaymentMethod: { cvc, resultHandler in
                    if let map = getPaymentMethodData2["_0"] as? NSDictionary,
                       let paymentToken = map["payment_token"] as? String {
                        self.completion = resultHandler
                        var map = [String: Any]()
                        map["paymentToken"] = paymentToken
                        map["cvc"] = cvc
                        self.safeResolve(callback, map, resultHandler)
                    }
                    else {
                        PaymentSession.hasResponded = true
                        let error = NSError(domain: "NotInitialised", code: 0, userInfo: [NSLocalizedDescriptionKey: "Not Initialised"])
                        resultHandler(.failed(error: error))
                    }
                },
                confirmWithCustomerPaymentToken: { paymentToken, cvc, resultHandler in
                    guard let cvc = cvc else {
                        let error = NSError(domain: "NotInitialised", code: 0, userInfo: [NSLocalizedDescriptionKey: "Not Initialised"])
                        resultHandler(.failed(error: error))
                        return
                    }
                    self.completion = resultHandler
                    var map = [String: Any]()
                    map["paymentToken"] = paymentToken
                    map["cvc"] = cvc
                    self.safeResolve(callback, map, resultHandler)
                }
            )
            PaymentSession.headlessCompletion?(handler)
        }
    }
    
    internal static func exitHeadless(rnMessage: String) {
        DispatchQueue.main.async {
            if let data = rnMessage.data(using: .utf8) {
                do {
                    if let message = try JSONSerialization.jsonObject(with: data, options: []) as? [String: String] {
                        guard let status = message["status"] else {
                            completion?(.failed(error: NSError(domain: "UNKNOWN_ERROR", code: 0, userInfo: ["message" : "An error has occurred."])))
                            return
                        }
                        switch status {
                        case "cancelled":
                            completion?(.canceled(data: status))
                        case "failed", "requires_payment_method":
                            let domain = (message["code"]) != "" ? message["code"] : "UNKNOWN_ERROR"
                            let errorMessage = message["message"] ?? "An error has occurred."
                            let userInfo = ["message": errorMessage]
                            completion?(.failed(error: NSError(domain: domain ?? "UNKNOWN_ERROR", code: 0, userInfo: userInfo)))
                        default:
                            completion?(.completed(data: status))
                        }
                    } else {
                        let domain = "UNKNOWN_ERROR"
                        let errorMessage = "An error has occurred."
                        let userInfo = ["message": errorMessage]
                        self.completion?(.failed(error: NSError(domain: domain , code: 0, userInfo: userInfo)))
                    }
                } catch {
                    let domain = "UNKNOWN_ERROR"
                    let errorMessage = "An error has occurred."
                    let userInfo = ["message": errorMessage]
                    self.completion?(.failed(error: NSError(domain: domain , code: 0, userInfo: userInfo)))
                }
            }
        }
    }
    
    private static func safeResolve(_ callback: @escaping RCTResponseSenderBlock,_ result: Any,_ resultHandler: @escaping (PaymentResult) -> Void){
        guard !PaymentSession.hasResponded else {
            print("Warning: Attempt to resolve callback more than once")
            resultHandler(.failed(error: NSError(domain: "Not Initialised", code: 0, userInfo: ["message" : "An error has occurred."])))
            return
        }
        PaymentSession.hasResponded = true
        callback([result])
    }
    
    private static func parseGetPaymentMethodData(_ readableMap: NSDictionary) -> PaymentMethod {
        let tag = readableMap["TAG"] as? String ?? ""
        let dataObject = readableMap["_0"] as? [String: Any]
        
        switch tag {
        case "SAVEDLISTCARD":
            if let it = dataObject {
                return Card(
                    isDefaultPaymentMethod: it["isDefaultPaymentMethod"] as? Bool ?? false,
                    paymentToken: it["payment_token"] as? String ?? "",
                    cardScheme: it["cardScheme"] as? String ?? "",
                    name: it["name"] as? String ?? "",
                    expiryDate: it["expiry_date"] as? String ?? "",
                    cardNumber: it["cardNumber"] as? String ?? "",
                    nickName: it["nick_name"] as? String ?? "",
                    cardHolderName: it["cardHolderName"] as? String ?? "",
                    requiresCVV: it["requiresCVV"] as? Bool ?? false,
                    created: it["created"] as? String ?? "",
                    lastUsedAt: it["lastUsedAt"] as? String ?? ""
                )
            }
        case "SAVEDLISTWALLET":
            if let it = dataObject {
                return Wallet(
                    isDefaultPaymentMethod: it["isDefaultPaymentMethod"] as? Bool ?? false,
                    paymentToken: it["payment_token"] as? String ?? "",
                    walletType: it["walletType"] as? String ?? "",
                    created: it["created"] as? String ?? "",
                    lastUsedAt: it["lastUsedAt"] as? String ?? ""
                )
            }
        default:
            return PMError(code: readableMap["code"] as? String ?? "",message: readableMap["message"] as? String ?? "No default type found")
        }
        return PMError(code: "01", message: "No default type found")
    }
}


@frozen public enum PaymentResult {
    case completed(data: String)
    case canceled(data: String)
    case failed(error: Error)
}
