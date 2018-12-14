import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

 host = 'https://my-messager.herokuapp.com'
//host = 'http://localhost:5432'


  getUsers() {

    // const headers = new HttpHeaders()
    //     .set('Content-Type', 'application/x-www-form-urlencoded')
    //     .set('Authorization', localStorage.getItem('Token'));

    // let options = new RequestOptions({ headers: headers });

    let token = localStorage.getItem('token');


    if (!token) {
      token = '';
    }

    const headers =  {
      headers: {
          'Authorization': token,
      }
    }


    //return this.http.get<[User]>(this.host+'/api/getusers')
    return this.http.post<[User]>(this.host+'/api/getusers?name=&email=','', headers)
  }

}
