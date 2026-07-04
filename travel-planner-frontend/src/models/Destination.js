export class Destination {
  constructor(id, planId, name, location, arrivalDate, departureDate, description) {
    this.id = id;
    this.planId = planId;
    this.name = name;
    this.location = location;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;
    this.description = description;
  }
}