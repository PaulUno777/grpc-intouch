import {loadPackageDefinition, credentials} from "@grpc/grpc-js";
import {loadSync} from "@grpc/proto-loader";

const packageDef = loadSync("payments.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const grpcObject = loadPackageDefinition(packageDef);
const paymentPackage = grpcObject.paymentPackage;

const text = process.argv[2];

const client = new paymentPackage.Payment(
    "localhost:50000",
    credentials.createInsecure()
);

await client.getAccountBalance(null, (err, response) => {
    if (err) console.log(err)
    console.log(response.amount)
})

// await client.checkTransactionStatus({transactionId: "1695214382649"}, (err, response)=>{
//     if (err) console.log(err)
//     console.log(response)
// })

// await  client.cashIn({phoneNumber:"676163500", amount:500},(err, response)=>{
//     if (err) console.log(err)
//     console.log(response)
//     console.log(response.cashInRes)
// })
