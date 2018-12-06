import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../User';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  providers: [
    LoginService
  ]
})
export class RegisterPageComponent implements OnInit {

  user = new User();

  constructor(private http: LoginService) { }


  ngOnInit() {
    
  }

  onChange(email, pasword) {
    console.log('data POST');
  	
    this.http.postRegister(this.user).subscribe((data) => {
      localStorage.setItem("token", data.token);
    })
  }

}
