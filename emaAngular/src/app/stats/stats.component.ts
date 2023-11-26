import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent {

  operationDb: any = {};

  constructor(private dbService: DatabaseService, private router: Router) {}

  ngOnInit() {
    this.dbService.getOperation().subscribe((data: any) => {
      this.operationDb = data;
    });
  }

}
