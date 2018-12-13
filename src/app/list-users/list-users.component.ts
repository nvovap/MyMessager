import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../User';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
  providers: [
    UsersService
  ]
})
export class ListUsersComponent implements OnInit {

  users: [User]

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.users = this.userService.getUsers()
  }

}
