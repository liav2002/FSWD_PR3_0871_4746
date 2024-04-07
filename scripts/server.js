import { FXMLHttpRequest } from "./FXMLHttpRequest.js";
import { Database } from "./DB.js";
import { User } from "./user.js";
export class Server{

    static url = 'issuesList.com';

    static handle(request, respond_method) {
        console.log(`${Server.url}`, request.body, 'method is', request.method);
        const resource = request.url.substring(Server.url.length);
        request.status = 4; 

        const handler = this.methodHandlers[request.method];
        if (handler) {
            handler(resource, request.body, respond_method);
        } else {
            console.log('Unsupported method:', request.method);
            respond_method({ status: 405, message: "Method Not Allowed" });
        }
    }

    static methodHandlers = {
        'GET': Server.handle_GET,
        'POST': Server.handle_POST,
        'PUT': Server.handle_PUT,
        'DELETE': Server.handle_DELETE,
    };

    static handle_GET(resource, body, callback){
        
        const options = {
            "/Login": (body, callback) => {
                const user = Database.get_user(body.username, body.password);
                if (user) {
                    callback({ status: 200, user });
                } else {
                    callback({ status: 404, user: undefined });
                }
            }//,{"/anotherOption"... }
        };

        const action = options[resource];
        if (action) action(body, callback);
    }

    static handle_POST(resource, body, callback) {
        const options = {};

        const action = options[resource];
        if (action) action(body, callback);
    }


    static handle_PUT(resource, body, callback) {
        const options = {
            "/SignUp": (body, callback) => {
                let user = Database.get_user(body.username, body.password);
                if (user) {
                    console.log('User already exists');
                    callback({ status: 404, user: undefined });
                } else {
                    console.log('User does not exist, signing up');
                    user = new User(body.username, body.password, body.fname, body.lname);
                    Database.add_user(user);
                    user = Database.get_user(body.username, body.password);
                    console.log(user);
                    callback({ status: 200, user: { email: user.email, username: user.username, password: user.password, id: user.id} });
                }
            }//,{"/anotherOption"... }
        };

        const action = options[resource];
        if (action) action(body, callback);
    }

    static handle_DELETE(resource, body, callback) {
        const options = {};

        const action = options[resource];
        if (action) action(body, callback);
    }
}