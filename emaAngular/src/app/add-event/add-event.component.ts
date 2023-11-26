import { Component } from '@angular/core';
import {DatabaseService} from "../database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  name: string = "";
  description: string = "";
  startDate: Date = new Date();
  durationInMinutes: number = 0;
  isActive: boolean = true;
  image: string = "";
  capacity: number = 0;
  ticketsAvailable: number = 0;
  categories: string = "";
  constructor(private dbService: DatabaseService, private router: Router) { }

  // Function called after form in add-event.component.html is submitted
  onSaveEvent() {
    let eventObj = {
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      durationInMinutes: this.durationInMinutes,
      isActive: this.isActive,
      image: this.image,
      capacity: this.capacity,
      ticketsAvailable: this.ticketsAvailable,
      categories: this.categories
    };
    // try and catch error in case there is a validation error
    this.dbService.createEvent(eventObj).subscribe(result => {
      this.router.navigate(["/listevents"]);}, error => {
      if (error.status === 400) {
        // Handle HTTP 400 error here
        console.log('Error 400: Invalid Data');
        // You can also navigate to an error page
        console.log(error);
        this.router.navigate(["/invalid-data"]);
      }
    });
  }

  ngOnInit() {
    console.log("Hello dev console from add-event.component");
    console.log("Updating records [operations]")
    this.dbService.updateRecords().subscribe((response: any) => {
      console.log(response); // Log the response from the server
    });
  }
}
