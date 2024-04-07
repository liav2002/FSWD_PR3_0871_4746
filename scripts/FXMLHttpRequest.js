import { network } from './network.js';

export class FXMLHttpRequest {
    open(method, url, body, onready_handler) {
        this.method = method;
        this.url = url;
        this.body = body;
        this.onready_handler = onready_handler;
        this.status = 0;
    }

    send() {
        network.send(this);
    }

}