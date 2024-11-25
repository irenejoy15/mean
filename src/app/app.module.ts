import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {PostCreateComponent } from './posts/post-create/post-create.component';

import {HeaderComponent} from './header/header.component';
import {PostListComponent } from './posts/post-list/post-list.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { PostEditComponent } from './posts/post-edit/post-edit.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error.interceptor';

import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from 'src/angular.module';
@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    PostEditComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent,ErrorComponent]
})
export class AppModule { }
