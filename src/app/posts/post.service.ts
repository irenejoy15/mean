import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import {Post} from './post.model'
import {map} from 'rxjs/operators'
import { response } from 'express';
import {Router} from '@angular/router';
import { Form } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsingle: Post;
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>(); 
    private postTest = new Subject<Post>(); 
    constructor(private http: HttpClient,private router:Router){}
    
    getPosts(postsPerPage:number, currentPage: number){
        const headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' };
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        // this.http.get<{message: string, posts:any[],maxPosts:number}>('http://localhost:82/mean-backend1/public/api/posts'+queryParams, {headers: headers})
        // .pipe(map((postData)=>{
            
        //     return{
        //         posts:postData.posts.map(post=>
        //         {
        //             return{
        //                 id: post.id,
        //                 title: post.title,
        //                 content: post.content,
        //                 imagePath : post.imagePath,
        //                 creator:post.creator
        //             };
        //         }), maxPosts:postData.maxPosts};
        //     }))
        // .subscribe((transformedPostsData)=>{
        //     console.log(transformedPostsData);
        //     this.posts = transformedPostsData.posts;
        //     this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts})
        // });
        this.http.get<{message: string, posts:any[],maxPosts:number}>('http://localhost:3000/api/posts'+queryParams)
        .pipe(map((postData)=>{
            return{
                posts:postData.posts.map(post=>
                {
                    return{
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath : post.imagePath,
                        creator:post.creator
                    };
                }), maxPosts:postData.maxPosts};
            }))
        .subscribe((transformedPostsData)=>{
            console.log(transformedPostsData);
            this.posts = transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts})
        });
    }
     
    onSearch(title_search:string){
        this.http.get<{message: string, posts:any[],maxPosts:number}>('http://localhost:82/mean-backend1/public/api/posts/search?title='+title_search)
        .pipe(map((postData)=>{
            return{
                posts:postData.posts.map(post=>
                {
                    return{
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        imagePath : post.imagePath,
                        creator: post.creator
                    };
                }), maxPosts:postData.maxPosts};
            }))
        .subscribe((transformedPostsData)=>{
            console.log(transformedPostsData);
            this.posts = transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts})
        });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id:any){
        // http://localhost:82/mean-backend1/public/api/posts/edittest/
        // http://localhost:3000/api/posts/
        // return this.http.get<{id:string,title:string,content:string,imagePath:string}>("http://localhost:82/mean-backend/public/api/posts/edittest/" + id);
        return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>("http://localhost:3000/api/posts/" + id);
    }

    getPostTest(id:any){
        return this.http.get("http://localhost:82/mean-backend1/public/api/posts/edittest/"+id);
        
    }

    getPostEditListener(){
        return this.postTest.asObservable();
    }

    // backup
    // addPost(title:string, content:string){
    //     // http://localhost:82/mean-backend/public/api/posts
    //     // http://localhost:3000/api/posts
    //     const post: Post = {id:null,title: title, content: content};
    //     this.http
    //     .post<{message: string, postId: string }>('http://localhost:3000/api/posts',post)
    //     .subscribe((responseData)=>{
    //         console.log(responseData.message);
    //         const id = responseData.postId;
    //         post.id = id;
    //         this.posts.push(post)
    //         this.postsUpdated.next([...this.posts]);
    //         this.router.navigate(['/']);
    //     });
    // }

    addPost(title:string, content:string,image:File){
        // http://localhost:82/mean-backend1/public/api/posts
        // http://localhost:3000/api/posts
        // const post: Post = {id:null,title: title, content: content};
        
        // FormData Combines Blob Data(image) and normal date
        const postData = new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);
        this.http
        .post<{message: string, post: Post}>('http://localhost:3000/api/posts',postData)
        .subscribe((responseData)=>{
            // const post: Post = {
            //     id:responseData.post.id,
            //     title:title,content,
            //     imagePath:responseData.post.imagePath
            // };
            // this.posts.push(post)
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof image === "object") {
          postData = new FormData();
          postData.append("id", id);
          postData.append("title", title);
          postData.append("content", content);
          postData.append("image", image, title);
        } else {
          postData = {
            id: id,
            title: title,
            content: content,
            imagePath: image,
            creator: null
          };
        }
           //  http://localhost:3000/api/posts/
        //  http://localhost:82/mean-backend/public/api/posts/
        this.http
            .post("http://localhost:3000/api/posts/" + id, postData)
            .subscribe(response => {
                // const updatedPosts = [...this.posts];
                // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                // const post: Post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imagePath: ""
                // };
                // updatedPosts[oldPostIndex] = post;
                // this.posts = updatedPosts;
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
        });
    }

    deletePost(postId: string){
        // // http://localhost:82/mean-backend/public/api/posts/
        // http://localhost:3000/api/posts/
        return this.http.delete("http://localhost:3000/api/posts/" + postId);
        // .subscribe(() => {
        //     const updatedPosts = this.posts.filter(post => post.id !== postId);
        //     this.posts = updatedPosts;
        //     this.postsUpdated.next([...this.posts]);
        // });
    }
}