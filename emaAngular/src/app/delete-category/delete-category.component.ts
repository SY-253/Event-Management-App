import { Component } from '@angular/core';
import { DatabaseService } from "../database.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})
export class DeleteCategoryComponent {
  categoryDb: any[] = [];

  constructor(private dbService: DatabaseService, private router: Router) {}

  onGetCategories() {
    return this.dbService.listCategory().subscribe((data: any) => {
      this.categoryDb = data;
    });
  }

  onDeleteCategory(item: any) {
    this.dbService.deleteCategory(item.categoryId).subscribe(results => {
      this.onGetCategories();
      this.router.navigate(["/listcategory"]);
    });
  }

  ngOnInit(): void {
    this.onGetCategories();
  }
}
