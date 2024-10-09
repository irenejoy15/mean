import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {Post} from './post.model'
import {map} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>(); 

    constructor(private http: HttpClient){}

    getPosts(){
        // this.http.get<{message: string, posts:any[]}>('http://localhost:82/mean-backend/public/api/posts')
        // .pipe(map((postData)=>{
        //     return postData.posts.map(post=>{
        //         return{
        //             title: post.title,
        //             content: post.content,
        //             id: post.id
        //         };
        //     });
        // }))
        // .subscribe((transformedPosts)=>{
        //     this.posts = transformedPosts;
        //     this.postsUpdated.next([...this.posts])
        // });
        this.http.get<{message: string, posts:any[]}>('http://localhost:3000/api/posts')
        .pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPosts)=>{
            this.posts = transformedPosts;
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
        .post<{message: string, postId: string }>('http://localhost:3000/api/posts',post)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            const id = responseData.postId;
            post.id = id;
            this.posts.push(post)
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string){
        // // http://localhost:82/mean-backend/public/api/posts
        // http://localhost:3000/api/posts
        this.http.delete("http://localhost:3000/api/posts/" + postId)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}