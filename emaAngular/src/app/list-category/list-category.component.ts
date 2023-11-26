import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})

export class ListCategoryComponent {

  categoryDb: any[] = [];

  constructor(private dbService: DatabaseService, private router: Router) {}

  ngOnInit() {
    return this.dbService.listCategory().subscribe((data: any) => {
      this.categoryDb = data;
    });
  }

  onViewCategory(categoryId: string) {
    this.router.navigate(['/viewcategory', categoryId]);
  }
}
