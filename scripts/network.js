import { FXMLHttpRequest } from './FXMLHttpRequest.js';
import { server } from './server.js' 
export class network {
    
    static send(FXMLHttpRequest) {
        console.log('network: ',FXMLHttpRequest.method, FXMLHttpRequest.url);
        if (FXMLHttpRequest.url.length < 0) {
            console.log('network: invalid url');
            return;
        }
        if(FXMLHttpRequest.url.split('/')[0] === 'server.com'){
            server.handle(FXMLHttpRequest, function (response){
                console.log('network: responding to client with ', response)
                FXMLHttpRequest.onready_handler(response);
            })
        }
    }

    


}