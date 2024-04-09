
export class User {

    constructor(username, password, email) {
        this.email = email
        this.username = username
        this.password = password
        this.id = undefined
    };

    json() {
        return {
            mail: this.email, 
            username: this.username,
            password: this.password,
            id: this.id
        }
    }
}