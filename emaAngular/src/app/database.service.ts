import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

const URL_CATEGORY = "http://localhost:8080/api/v1/category/32880545/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private http: HttpClient) {}
  
  addCategory(data: any) {
    return this.http.post(URL_CATEGORY + "/add", data, httpOptions);
  }

  listCategory() {
    return this.http.get(URL_CATEGORY + "/list");
  }

  deleteCategory(categoryId: string) {
    let url = URL_CATEGORY + "/delete?categoryId=" + categoryId;
    return this.http.delete(url, httpOptions);
  }

  updateCategory(data: any) {
    return this.http.put(URL_CATEGORY + "/update", data, httpOptions);
  }

  viewCategory(categoryId: string) {
    let url = URL_CATEGORY + "/view?categoryId=" + categoryId;
    return this.http.get(url);
  }

  createEvent(data: object) {
    return this.http.post("/bryan/api/v1/event/add", data, httpOptions);
  }

  getEvents() {
    return this.http.get("/bryan/api/v1/event/view-all");
  }

  getEventById(eventId: string){
    return this.http.get("/bryan/get-event?eventId=" + eventId);
  }

  updateEvent(data: object) {
    return this.http.put("/bryan/api/v1/event/update", data, httpOptions);
  }

  getOperation(){
    return this.http.get("/getOperation");
  }

  deleteEvent(eventId: string) {
    let url = "/bryan/api/v1/event/delete?eventId=" + eventId;
    return this.http.delete(url, httpOptions);
  }

  updateRecords() {
    return this.http.get("/update-records")
  }
}
