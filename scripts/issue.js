export class Issue {

    constructor(assign_user_id, title, label, description, due_date) {
        this.id = undefined
        this.title = title
        this.assign_user_id = assign_user_id
        this.label = label
        this.description = description
        this.due_date = due_date
    };

    json() {
        return {
            id: this.id,
            title: this.title,
            assign_user_id: this.assign_user_id,
            label: this.label,
            description: this.description,
            due_date: this.due_date
        }
    }
}