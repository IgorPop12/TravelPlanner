export class Expense {
  constructor(id, planId, name, category, amount, date, description) {
    this.id = id;
    this.planId = planId;
    this.name = name;
    this.category = category;
    this.amount = amount;
    this.date = date;
    this.description = description;
  }
}