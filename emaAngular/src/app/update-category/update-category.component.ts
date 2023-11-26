import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})

export class UpdateCategoryComponent {
  categoryId: string = "";
  name: string = "";
  description: string = "";

  constructor(private dbService: DatabaseService, private router: Router) {}

  onUpdateCategory() {
    let obj = { categoryId: this.categoryId, name: this.name, description: this.description };
    this.dbService.updateCategory(obj).subscribe(
      result => {
        this.router.navigate(["/listcategory"]);
      },
      error => {
        if (error.status == 400)
          this.router.navigate(["/invaliddataerror"]);
      }
    );
  }
}
