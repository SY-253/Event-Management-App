import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-event',
  templateUrl: './delete-event.component.html',
  styleUrls: ['./delete-event.component.css']
})

export class DeleteEventComponent implements OnInit {
  eventsDB: any[] = [];

  constructor(private dbService: DatabaseService, private router: Router) { }
  //Get all Events
  onGetEvents() {
    return this.dbService.getEvents().subscribe((data: any) => {
      this.eventsDB = data;
    });
  }

  //Delete event, use "id" as backend is coded to use id instead of _id
  onDeleteEvent(anEvent: any) {
    this.dbService.deleteEvent(anEvent.id).subscribe(result => {
      this.onGetEvents();
      this.router.navigate(["/listevents"]);
    });
  }

  // This callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetEvents();
  }
}
