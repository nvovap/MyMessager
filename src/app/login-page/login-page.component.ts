import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../User';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: [
    LoginService
  ]

})
export class LoginPageComponent implements OnInit {

  user = new User();

  constructor(private http: LoginService) { }


  ngOnInit() {
    
  }

  onChange(email, pasword) {
    console.log('data POST');
  	
    this.http.postRegister(this.user).subscribe((data) => {
      console.log(data);
    })
  }

}
