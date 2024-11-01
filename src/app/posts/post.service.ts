import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {Post} from './post.model'
import {map} from 'rxjs/operators'
import { response } from 'express';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsingle: Post;
    private postsUpdated = new Subject<Post[]>(); 
    private postTest = new Subject<Post>(); 
    constructor(private http: HttpClient,private router:Router){}
    
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
     
    onSearch(title_search:string){
        this.http.get<{message: string, posts:any[]}>('http://localhost:82/mean-backend/public/api/posts/search?title='+title_search)
        .pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return{
                    title: post.title,
                    content: post.content,
                    id: post.id
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

    getPost(id:any){
        // http://localhost:82/mean-backend/public/api/posts/edittest/
        // http://localhost:3000/api/posts/
        // return this.http.get<{id:string,title:string,content:string}>("http://localhost:82/mean-backend/public/api/posts/edittest/" + id);
        return this.http.get<{_id:string,title:string,content:string}>("http://localhost:3000/api/posts/" + id);
    }

    getPostTest(id:any){
        return this.http.get("http://localhost:82/mean-backend/public/api/posts/edittest/"+id);
        
    }

    getPostEditListener(){
        return this.postTest.asObservable();
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
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content:string){
        const post: Post = {
            id:id,
            title:title,
            content:content
        };
        //  http://localhost:3000/api/posts/
        //  http://localhost:82/mean-backend/public/api/posts/
        this.http.put("http://localhost:3000/api/posts/" + id, post)
        .subscribe(response=>{
            // const updatedPosts = {...this.posts};
            // const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id);
            // updatedPosts[oldPostIndex] = post;
            // this.posts = updatedPosts;
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    deletePost(postId: string){
        // // http://localhost:82/mean-backend/public/api/posts/
        // http://localhost:3000/api/posts/
        this.http.delete("http://localhost:3000/api/posts/" + postId)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}