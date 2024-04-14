import { FXMLHttpRequest } from "./FXMLHttpRequest.js";
import { Database } from "./DB.js";
import { User } from "./user.js";
import { Issue} from "./issue.js";

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
                Database.setLoggedInUser(user);
                if (user) {
                    callback({ status: 200, user });
                } else {
                    callback({ status: 404, user: undefined });
                }
            },
            "/isAnyoneLoggedIn": (body, callback) => {
                const user = Database.getLoggedInUser();
                if (user) {
                    console.log("detect loggedIn user")
                    callback({ status: 200, user });
                } else {
                    callback({ status: 404, user: undefined });
                }
            },
            "/GetIssues": (body, callback) => {
                if (Database.initialize_issues()){
                    const issues = Database.issues;
                    console.log("issues retrived.")
                    callback({status: 200, issues: issues});
                }
                else{
                    console.log("issues item is missing in local storage. empty item is adding now.")
                    Database.create_empty_issues_item();
                    callback({status: 200, issues: issues});
                }
            },
            "/GetIssue": (body, callback) => {
                const issue = Database.get_issue(body.id);
                if (issue) {
                    console.log("Issue retrived.");
                    callback({status: 200, issue});
                }
                else{
                    console.log("Error with retriving issue.");
                    callback({status: 404, issue: undefined});
                }
            },
            "/GetUsers": (body, callback) => {
                const users = Database.get_usernames();
                if(users){
                    console.log("Users list retrived.");
                    callback({status: 200, users});
                }
                else{
                    console.log("Error with retriving issue.");
                    callback({status: 404, users: undefined});
                }
            }
        };

        const action = options[resource];
        if (action) action(body, callback);
    }

    static handle_POST(resource, body, callback) {
        const options = {
            "/AddIssue": (body, callback) => {
                let issue = new Issue(body.assignee, body.title, body.label, body.description, body.dueDate);
                let res = Database.add_issue(issue);
                if (res === 1) {
                    console.log("Issue successfully added.");
                    callback({status: 200});
                }
                else {
                    callback({status: 303});
                }
            },
            "/Logout": (body, callback) => {
                let res = Database.logout();
                if (res === 1) {
                    console.log('User logged out successfully');
                    callback({status: 200});
                }
                else {
                    callback({status: 303});
                }
            }
        };

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
            },
            "/ChangeIssueLabel": (body, callback) => {
                if(Database.change_issue_label(body.id, body.new_lable))
                    callback({status: 200});
                else
                    callback({status: 300});
            }
        };

        const action = options[resource];
        if (action) action(body, callback);
    }

    static handle_DELETE(resource, body, callback) {
        const options = {
            "/DeleteIssue": (body, callback) => {
                let res = Database.remove_issue(body.id);
                if (res === 1) {
                    console.log("Issue successfully removed.");
                    callback({status: 200});
                }
                else {
                    console.log("Failed to remove the issue.");
                    callback({status: 303});
                }
            }
        };

        const action = options[resource];
        if (action) action(body, callback);
    }
}