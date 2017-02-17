import {computedFrom} from "aurelia-framework";

export class Sponsors {
	constructor() {
		this.message = "Sponsors";
		setTimeout(() => this.message = "Changed after binding",3000);
		this.mapCollection = new window.Map();
		this.mapCollection.set("a", "Alpha");
		this.mapCollection.set("b", "Beta");
		this.mapCollection.set("c", "Charlie");
		this.mapCollection.set("d", "Delta");
		this.styleString = "background:Red";
		this.styleObject = {background: "green"};
		this.firstName = "Evan";
		this.lastName = "Aktoudianakis";
	}

	@computedFrom("firstName", "lastName")
	get fullName(){return this.firstName + ", " + this.lastName}

	doSomething(foo) {
		console.log(foo);
	}
}