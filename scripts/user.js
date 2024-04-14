
export class User {

    constructor(username, password, email) {
        this.admin = 0;
        this.email = email
        this.username = username
        this.password = password
        this.id = undefined
    };

    json() {
        return {
            admin: this.admin,
            mail: this.email, 
            username: this.username,
            password: this.password,
            id: this.id
        }
    }
}