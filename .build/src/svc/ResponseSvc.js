"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("cookie"));
class ResponseSvc {
    constructor() {
        this.response = (event) => {
            // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
            // https://stackoverflow.com/questions/43190935/setting-http-response-header-from-aws-lambda#43194717
            // https://en.wikipedia.org/wiki/HTTP_cookie#Expires_and_Max-Age
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);
            const cookieConfig = {
                maxAge: 60 * 60 * 24 * 365,
                expires: expiry
            };
            const myCookie = cookie_1.default.serialize('mycookie', 'chocolateChip', cookieConfig);
            const resp = {
                statusCode: 200,
                body: JSON.stringify(event),
                headers: {
                    "Set-Cookie": myCookie
                }
            };
            return resp;
        };
    }
}
exports.default = ResponseSvc;
//# sourceMappingURL=ResponseSvc.js.map