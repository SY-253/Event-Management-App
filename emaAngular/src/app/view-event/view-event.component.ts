import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../database.service";

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent {
  eventId: string = '';
  event: any; // Assuming you have a variable to store the event details

  constructor(private route: ActivatedRoute, private router: Router, private dbService: DatabaseService) {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      console.log(this.eventId);
      // Now you can use this eventId to fetch the event details from your data source
      // For example, you can make an API call or retrieve it from a service.
      // Once you have the event details, assign it to 'this.event'.
    });
  }
  ngOnInit() {
    this.dbService.getEventById(this.eventId).subscribe((data: any) => {
      this.event = data;
    });
  }

}
