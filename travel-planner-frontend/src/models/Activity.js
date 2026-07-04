export class Activity {
  constructor(id, planId, destinationId, name, date, time, location, description, estimatedCost, status) {
    this.id = id;
    this.planId = planId;
    this.destinationId = destinationId;
    this.name = name;
    this.date = date;
    this.time = time;
    this.location = location;
    this.description = description;
    this.estimatedCost = estimatedCost;
    this.status = status;
  }
}