import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../database.service";

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})

export class ViewCategoryComponent {
  
  categoryId: string = "";
  category: any;

  constructor(private route: ActivatedRoute, private router: Router, private dbService: DatabaseService) {
    this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
    });
  }

  ngOnInit() {
    this.dbService.viewCategory(this.categoryId).subscribe((data: any) => {
      this.category = data;
      console.log(this.category);
      console.log(this.category.eventsList);
    });
  }

  showEventDetails(eventId: number) {
    this.router.navigate(['/viewevent', eventId]);
  }
}
