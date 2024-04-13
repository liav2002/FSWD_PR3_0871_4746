
export class Database {
    
    static users = new Map(); 
    static issues = new Map ();
    static usersLoaded = false; 
    static issuesLoaded = false;

    static save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }

    static load(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : {};
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            return {};
        }
    }

    static initialize_users() {
        if (!Database.usersLoaded) {
            const users = Database.load('users');
            Object.keys(users).forEach(key => {
                Database.users.set(key, users[key]);
            });
            Database.usersLoaded = true;
        }
    }

    static add_user(user) {
        Database.initialize_users();
        const userId = String(Database.users.size);
        user.id = userId;
        Database.users.set(userId, user.json());
        Database.save('users', Object.fromEntries(Database.users));
    }

    static get_user(username, password) {
        Database.initialize_users();
        for (const [id, user] of Database.users) {
            if (user.username === username && user.password === password) {
                return { ...user, id };
            }
        }
        return undefined;
    }
 
    static get_usernames() {
        Database.initialize_users();
        const usernames = [];
        for (const [, user] of Database.users) {
            usernames.push(user.username);
        }
        return usernames;
    }

    static setLoggedInUser(loggedInUser){
        try {
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        } catch (error) {
            console.error("Error saving loggedInUser to localStorage:", error);
        }
    }

    static getLoggedInUser() {
        try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            return loggedInUser ? JSON.parse(loggedInUser) : null;
        } catch (error) {
            console.error("Error loading loggedInUser from localStorage:", error);
            return null;
        }
    }

    static initialize_issues() {
        if (!Database.issuesLoaded) {
            const issues = Database.load('issues');
            
            if(Object.keys(issues).length === 0 && issues.constructor === Object)
            {
                return 0;
            }

            Object.keys(issues).forEach(key => {
                Database.issues.set(key, issues[key]);
            });
            Database.issuesLoaded = true;

            return 1;
        }
    }

    static create_empty_issues_item(){
        console.log("try to create issues item in local storage");
        localStorage.setItem('issues', JSON.stringify({}));
        console.log("empty issues item created in local storage");
    }

    static get_issue(issue_id) {
        Database.initialize_issues();
        for (const [id, issue] of Database.issues) {
            if (issue.id == issue_id) {
                return { ...issue, id };
            }
        }
        return undefined;

    }

    static add_issue(issue) {
        // TODO: implement
    }

    static change_issue_label(issue_id, new_label) {
        Database.initialize_issues();
    
        for (const [id, issue] of Database.issues) {
            if (issue.id === parseInt(issue_id)) {
                issue.label = new_label;
                console.log(Database.issues);
                Database.save('issues', Object.fromEntries(Database.issues));
                Database.issuesLoaded = false;
                return { ...issue, id };
            }
        }
    
        return undefined;
    }
}