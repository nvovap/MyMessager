import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  host = 'https://my-messager.herokuapp.com'


  getUsers() {
    const option = {
      headers:{
        'Authorization' : localStorage.getItem('Token')
      }
    }


      return this.http.get<[User]>(this.host+'',option); 
  }

}
