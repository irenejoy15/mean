import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {Post} from './post.model'

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>(); 

    constructor(private http: HttpClient){}

    getPosts(){
        // http://localhost:82/mean-backend/public/api/posts
        this.http.get<{message: string, posts:Post[]}>('http://localhost:3000/api/posts')
        .subscribe((postData)=>{
            this.posts = postData.posts;
            this.postsUpdated.next([...this.posts])
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title:string, content:string){
        // http://localhost:82/mean-backend/public/api/posts
        // http://localhost:3000/api/posts
        const post: Post = {id:null,title: title, content: content};
        this.http
        .post<{message: string}>('http://localhost:3000/api/posts',post)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            this.posts.push(post)
            this.postsUpdated.next([...this.posts]);
        });
    }
}