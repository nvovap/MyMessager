import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../User';
import { Router } from '@angular/router';


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

  constructor(private http: LoginService, private router: Router) { }


  ngOnInit() {
    
  }

  onChange() {
    console.log('data POST');
  	
    this.http.postLogin(this.user).subscribe((data) => {
      localStorage.setItem("token", data.token);

      this.router.navigate(['/'])
    })
  }

}
