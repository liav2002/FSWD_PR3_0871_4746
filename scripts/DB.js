
export class Database {
    
    static users = new Map(); 
    static usersLoaded = false; 

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
}