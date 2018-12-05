import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  {path: '', component: WorkspaceComponent},
  {path: 'login', component: LoginPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
