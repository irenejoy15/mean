import { HttpClient, HttpHeaders,HttpClientXsrfModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import axios from 'axios';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
@Injectable({providedIn:"root"})
export class AuthService{
    private isAuthenticated = false;
    private token:string;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();
    constructor(private http:HttpClient,private router: Router){}

    getToken(){
        console.log(this.token);
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email:string,password:string){
        //http://localhost:82/mean-backend/public/api/signup"
        //http://localhost:3000/api/user/signup
        const authData : AuthData = {email:email,password:password}
        this.http.post("http://localhost:3000/api/user/signup",authData)
            .subscribe(response=>{
                console.log(response);
            });
    }

    login(email:string,password:string){
        //http://localhost:82/mean-backend/public/api/login"
        // http://localhost:3000/api/user/login
        // / http://localhost:82/mean-backend/public/api/logout
        const authData : AuthData = {email:email,password:password}

        // axios.defaults.withCredentials = true;
        // axios.defaults.withXSRFToken = true;
        // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        // const headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' };
        // axios.get('http://localhost:82/mean-backend/public/sanctum/csrf-cookie',{headers}).then(response=>{
        //     this.http.post<{token:string,expiresIn:number}>("http://localhost:82/mean-backend1/public/api/login",authData,{headers})
        //     .subscribe(response=>{
        //         const token = response.token;
        //         this.token = token;
        //     if(token){
        //         const expiresInDuration =response.expiresIn;
        //         this.setAuthTimer(expiresInDuration);
        //         this.isAuthenticated = true;
        //         this.authStatusListener.next(true);
        //         const now = new Date();
        //         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        //         console.log(expirationDate);
        //         this.saveAuthData(token, expirationDate);
        //         this.router.navigate(['/']);
            
        //     }
        //     });
        // });

        this.http.post<{token:string,expiresIn:number}>("http://localhost:3000/api/user/login",authData)
        .subscribe(response=>{
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration =response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/']);
            }
        });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
          return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
          this.token = authInformation.token;
          this.isAuthenticated = true;
          this.setAuthTimer(expiresIn / 1000);
          this.authStatusListener.next(true);
        }
      }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
      
    }

    private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
      }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
      }
    
    private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return 0;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}