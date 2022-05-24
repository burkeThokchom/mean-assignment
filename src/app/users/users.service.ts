import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { throwError as observableThrowError, Observable, observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  API_URL=`${environment.API_URL}/users`
  constructor(private http: HttpClient) { }

  handleError(error: Response | any){
    console.error('user-service: handleError', error);
    return Observable.throw(error);
  }

  createUser(userData:any):Observable<any>{
    const path = `${this.API_URL}`;
    return this.http.post(path, {userData})
  }
  
  getAllUsers(query: any):Observable<any[]>{
    let params = new HttpParams();
    if(query['page']){
      params = params.append('page', query['page']);
    }
    if(query['pageSize']){
      params = params.append('pageSize', query['pageSize'])
    }
    params = params.append('searchValue', query['searchValue']);

    return this.http
    .get(this.API_URL, {params})
    .pipe(
      map((response: any) => response),
      catchError((error:any)=> observableThrowError(error.error || "Server Error")) 
    );
  }

  deleteUser(id:string){
    const path = `${this.API_URL}/${id}`;
    return this.http.delete(path)
  }

  getUserById(userId:string){
    const path = `${this.API_URL}/${userId}`;
    return this.http
    .get(path)
    .pipe(
      map((response: any) => response.data),
      catchError((error:any)=> observableThrowError(error.error || "Server Error")) 
    );
  }

  updateUser(userData:any){
    const path = `${this.API_URL}/${userData._id}`;
    return this.http.put(path, {document: userData})
  }
}
