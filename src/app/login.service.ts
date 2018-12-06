import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Token } from './User';


// const HttpUploadOptions = {
//   headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
// }

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }



  postLogin(user: User){
         
    const body = {email: user.email, password: user.password};

    let input = new FormData();
    // Add your values in here
    input.append('email', user.email);
    input.append('password', user.password);
    return this.http.post<Token>('http://localhost:54321/api/login', input); 
  }

  postRegister(user: User){
         
    const option = {
      headers:{
        'content-type':"application/x-www-form-urlencoded"
      }
    }; 

    // const option = {
    //   headers:{
    //     'content-type':"multipart/form-data"
    //   }
    // }; 


    //const body = {email: user.email, name: user.name, password: user.password, phone: user.phone};

    let input = new FormData();
    // Add your values in here
    input.append('email', user.email);
    input.append('name', user.name);
    input.append('password', user.password);
    input.append('phone', user.phone);


    return this.http.post<Token>('http://localhost:54321/api/register', input); 

    //return this.http.post<User>('http://localhost:54321/api/register', user, option); 
  }


}
