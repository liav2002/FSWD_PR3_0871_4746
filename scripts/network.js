import { FXMLHttpRequest } from './FXMLHttpRequest.js';
import { Server } from './server.js' 
export class network {
    
    static send(FXMLHttpRequest) {
        console.log(FXMLHttpRequest.method, FXMLHttpRequest.url);
        if (FXMLHttpRequest.url.length < 0) {
            console.log('Error in url');
            return;
        }
        if(FXMLHttpRequest.url.split('/')[0] === 'issuesList.com'){
            Server.handle(FXMLHttpRequest, function (response){
                console.log(response)
                FXMLHttpRequest.handler(response);
            })
        }
    }

}