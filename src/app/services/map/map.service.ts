import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, AsyncSubject } from "rxjs";
import { Map } from "mapbox-gl";

@Injectable({
  providedIn: "root",
})
export class MapService {
  map = new AsyncSubject<Map>();
  constructor(private http: HttpClient) {}

  getData(file = 1): Observable<any> {
    return this.http.get<any>(`../../../assets/data.${file}.json`);
  }
}
