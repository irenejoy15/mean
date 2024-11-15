import { HttpClient, HttpHeaders,HttpClientXsrfModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import axios from 'axios';
import { Subject } from "rxjs";
@Injectable({providedIn:"root"})
export class AuthService{
    private token:string;
    private authStatusListener = new Subject<boolean>();
    constructor(private http:HttpClient){}

    getToken(){
        console.log(this.token);
        return this.token;
    }

    getAuthStatusListener(){
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
        const headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' };
        // // axios.get('http://localhost:82/mean-backend/public/sanctum/csrf-cookie',{headers}).then(response=>{
        //     this.http.post<{token:string}>("http://localhost:82/mean-backend/public/api/login",authData,{headers})
        //     .subscribe(response=>{
        //         const token = response.token;
        //         this.token = token;
        //          this.authStatusListener.next(true);
        //         console.log(response)
        //     });
        // // });

        this.http.post<{token:string}>("http://localhost:3000/api/user/login",authData)
        .subscribe(response=>{
            const token = response.token;
            this.token = token;
            this.authStatusListener.next(true);
        });
    }
}