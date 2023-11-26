import { Component } from '@angular/core';
import {DatabaseService} from "../database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent {

  id: string = "";
  name: string = "";
  capacity: number = 0;
  constructor(private dbService: DatabaseService, private router: Router) { }

  // Function called after form in add-event.component.html is submitted
  onUpdateEvent() {
    let updateEventObj = {
      eventId: this.id,
      name: this.name,
      capacity: this.capacity,
    };
    // try and catch error in case there is a validation error
    this.dbService.updateEvent(updateEventObj).subscribe(result => {
      this.router.navigate(["/listevents"]);}, error => {
      if (error.status === 400) {
        // Handle HTTP 400 error here
        console.log('Error 400: Invalid Data');
        // You can also navigate to an error page if you have one
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

