import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  {path: '', component: WorkspaceComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
