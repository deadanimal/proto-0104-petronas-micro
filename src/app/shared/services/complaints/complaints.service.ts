import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Form } from "@angular/forms";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Complaint } from "./complaints.model";

@Injectable({
  providedIn: "root",
})
export class ComplaintsService {
  // URL
  public urlComplaint: string = environment.baseUrl + "v1/complaints/";

  // Data
  public Complaint: Complaint;
  public Complaints: Complaint[] = [];
  public ComplaintsFiltered: Complaint[] = [];

  constructor(private http: HttpClient) {}

  create(body: Form): Observable<Complaint> {
    console.log(this.urlComplaint);
    console.log(body);
    return this.http.post<any>(this.urlComplaint, body).pipe(
      tap((res) => {
        console.log("Complaints: ", res);
      })
    );
  }

  getAll(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.urlComplaint).pipe(
      tap((res) => {
        console.log("Complaints: ", res);
      })
    );
  }

  getOne(id: String): Observable<Complaint> {
    let urlComplaintOne = this.urlComplaint + id + "/";
    return this.http.get<Complaint>(urlComplaintOne).pipe(
      tap((res) => {
        console.log("Complaint: ", res);
      })
    );
  }

  update(id: String, body: Form): Observable<Complaint> {
    let urlComplaintOne = this.urlComplaint + id + "/";
    console.log(urlComplaintOne);
    console.log(body);
    return this.http.put<Complaint>(urlComplaintOne, body).pipe(
      tap((res) => {
        console.log("Complaint", res);
      })
    );
  }

  filter(field: String): Observable<Complaint[]> {
    let urlFilter = this.urlComplaint + "?" + field + "/";
    return this.http.get<Complaint[]>(urlFilter).pipe(
      tap((res) => {
        console.log("Complaints", res);
      })
    );
  }
}
