import { FXMLHttpRequest } from './FXMLHttpRequest.js';
import { Server } from './server.js' 
export class network {
    
    static send(FXMLHttpRequest) {
        if(FXMLHttpRequest.url.split('/')[0] === 'issuesList.com'){
            Server.handle(FXMLHttpRequest, function (response){
                FXMLHttpRequest.handler(response);
            })
        }
    }

}