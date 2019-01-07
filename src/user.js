export default class User {
    constructor(host, email, token) {
        this.host = host;
        this.email = email;
        this.token = token;
    }
    toString() {
        return `[User ${this.email}]`
    }
}