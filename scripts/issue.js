export class Issue {

    constructor(assignee, title, label, description, dueDate) {
        this.id = undefined
        this.title = title
        this.assignee = assignee
        this.label = label
        this.description = description
        this.dueDate = dueDate
    };

    json() {
        return {
            id: this.id,
            title: this.title,
            assignee: this.assignee,
            label: this.label,
            description: this.description,
            dueDate: this.dueDate
        }
    }
}