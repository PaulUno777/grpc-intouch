import {
    loadPackageDefinition,
    Server,
    status,
    ServerCredentials,
} from "@grpc/grpc-js";
import {loadSync} from "@grpc/proto-loader";
import dotenv from 'dotenv'
import {checkCarrier, fetchData, header, service_id} from "./util.js";

dotenv.config();

const packageDef = loadSync("payments.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const grpcObject = loadPackageDefinition(packageDef);
const paymentPackage = grpcObject.paymentPackage;

const server = new Server();

server.addService(paymentPackage.Payment.service, {
    getAccountBalance: getAccountBalance,
    checkTransactionStatus: checkTransactionStatus,
    cashIn:cashIn
});

async function getAccountBalance(call, callback) {
    const reqBody = {
        "partner_id": process.env.partner_id,
        "login_api": process.env.login_api,
        "password_api": process.env.password_api,
    }
    let request = {
        url: process.env.check_account_balance_url.toString(),
        method: "post",
        headers: header,
        body: reqBody
    }
    const response = await fetchData(request)
    if (response.error && response.error === true) callback({code: status.INTERNAL, details: response.errorData.description || "An error occurred!"});
    const amount = response.amount
    callback(null, {amount})
}

async function checkTransactionStatus(call, callback) {
    let reqBody = {
        "partner_id": process.env.partner_id,
        "login_api": process.env.login_api,
        "password_api": process.env.password_api,
        "partner_transaction_id": call.request.transactionId
    }
    let request = {
        url: process.env.check_transaction_status_url.toString(),
        method: "post",
        headers: header,
        body: reqBody
    }
    const response = await fetchData(request)
    if(response.status === "NOTFOUND") callback({code:status.NOT_FOUND, details: "Transaction not found!"})
    if (response.error && response.error === true) callback({code: status.INTERNAL, details: response.errorData.description || "An error occurred!"});
    callback(null, response)
}

async function cashIn(call, callback) {

    const carrier = checkCarrier(call.request.phoneNumber)
    if (!carrier) callback({code:status.INVALID_ARGUMENT, details:"Invalid phone number!"});

    let reqBody = {
        "service_id": service_id[carrier],
        "recipient_phone_number": call.request.phoneNumber,
        "amount": call.request.amount,
        "partner_id": process.env.partner_id,
        "partner_transaction_id": Date.now(),
        "login_api": process.env.login_api,
        "password_api": process.env.password_api,
        "call_back_url": process.env.call_back_url
    }
    let request = {
        url: process.env.cash_in_url.toString(),
        method: "post",
        headers: header,
        body: reqBody
    }
    const response = await fetchData(request)
    if (response.error && response.error === true) callback({code: status.INTERNAL, details: response.errorData.description || "An error occurred!"});
    callback(null, response)
}

server.bindAsync(
    "127.0.0.1:50000",
    ServerCredentials.createInsecure(),
    (error, port) => {
        server.start();
        console.log(`listening on port ${port}`);
    }
);
