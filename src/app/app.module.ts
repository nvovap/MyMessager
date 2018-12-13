import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MessageComponent } from './message/message.component';
import { TimeComponent } from './time/time.component';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ListUsersComponent } from './list-users/list-users.component';





@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    MessageComponent,
    TimeComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ListUsersComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
