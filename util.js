import axios from "axios";
import dotenv from 'dotenv'
dotenv.config();
export async function fetchData(options) {
    try {
        let request = {
            method: options.method,
            url: options.url,
        }
        if (options.headers) request.headers = options.headers
        if (options.body) request.data = options.body
        const resp = await axios(request)
        console.log(resp)
        return resp.data
    } catch (e) {
        return {
            error: true,
            errorData: e.response.data,
            status: e.response.status
        };
    }
}

export function checkCarrier(phone) {
    if (/^(69\d{7}|65[5-9]\d{6})$/.test(phone.toString())) {
        return "OM";
    } else if (/^(67\d{7}|68[0-4]\d{6}|65[0-4]\d{6})$/.test(phone)) {
        return "MOMO";
    }
    return false;
}

export const service_id = {
    OM: "CASHINOMCMPART2",
    MOMO: "CASHINMTNCMPART"
}

export const header = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa(process.env.auth_username + ':' + process.env.auth_password)
}
