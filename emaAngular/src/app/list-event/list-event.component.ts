import { Component } from '@angular/core';
import {DatabaseService} from "../database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent {

  eventsDB: any[] = [];
  constructor(private dbService: DatabaseService, private router: Router) { }

  // ngOnInit is an inbuilt Angular function: purpose of it being "run" or "initialised" upon this component
  // being called. In a way, it can be viewed as a "constructor" but for angular component

  ngOnInit() {
    console.log("Hello dev console from list-event.component");
    console.log("Updating records [operations]")
    this.dbService.updateRecords().subscribe((response: any) => {
      console.log(response); // Log the response from the server
    });
    this.dbService.getEvents().subscribe((data: any) => {
      this.eventsDB = data;
    });
  }

  //View event, pass through the event object into the view-event.component
  showEventDetails(eventId: number) {
    this.router.navigate(['/viewevent', eventId]);
  }

}
