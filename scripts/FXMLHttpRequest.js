import { network } from './network.js';

export class FXMLHttpRequest {
    open(method, url, body, handler) {
        this.method = method;
        this.url = url;
        this.body = body;
        this.handler = handler;
        this.status = 0;
    }

    send() {
        network.send(this);
    }

}