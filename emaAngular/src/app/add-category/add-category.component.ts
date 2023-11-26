import { Component } from '@angular/core';
import { DatabaseService } from "../database.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {

  name: string = "";
  description: string = "";
  image: string = "";
  createdAt: Date = new Date();

  constructor(private dbService: DatabaseService, private router: Router) {}

  onSaveCategory() {
    let obj = { name: this.name, description: this.description, image: this.image };
    this.dbService.addCategory(obj).subscribe(
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
