import { Component } from '@angular/core';
import {DatabaseService} from "../database.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stats-g2',
  templateUrl: './stats-g2.component.html',
  styleUrls: ['./stats-g2.component.css']
})
export class StatsG2Component {
  // Modify to accept an object, not an array
  operationDB: any = {};
  constructor(private dbService: DatabaseService, private router: Router) { }

  // ngOnInit is an inbuilt Angular function: purpose of it being "run" or "initialised" upon this component
  // being called. In a way, it can be viewed as a "constructor" but for angular component

  ngOnInit() {
    console.log("Hello dev console from stats-g2.component");

    this.dbService.updateRecords().subscribe((response: any) => {
      console.log(response); // Log the response from the server
    });

    //Retrieve the singular operation object
    this.dbService.getOperation().subscribe((data: any) => {
      console.log("DATA: " + data);
      console.log("Stringified DATA: ", JSON.stringify(data, null, 2));
      this.operationDB = data;
    });
  }
}
