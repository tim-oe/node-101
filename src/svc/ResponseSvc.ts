
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import cookie, { CookieSerializeOptions } from "cookie";

export default class ResponseSvc {

    public response = (event: APIGatewayProxyEvent) : APIGatewayProxyResult => {
 
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
        // https://stackoverflow.com/questions/43190935/setting-http-response-header-from-aws-lambda#43194717
        // https://en.wikipedia.org/wiki/HTTP_cookie#Expires_and_Max-Age
        const expiry: Date = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);    
        const cookieConfig: CookieSerializeOptions = {
            maxAge: 60 * 60 * 24 * 365, // 1 yr
            expires: expiry 
        };
        const myCookie: string = cookie.serialize('mycookie', 'chocolateChip', cookieConfig);
    
        const resp: APIGatewayProxyResult = {
            statusCode: 200,
            body: JSON.stringify(event),
            headers: {
                "Set-Cookie": myCookie
            }
        };
    
        return resp;        
    }
}