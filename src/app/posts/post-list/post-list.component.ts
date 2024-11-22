import {Component, OnDestroy, OnInit} from '@angular/core'
import { Subscription } from 'rxjs';
import {Post} from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import axios from 'axios';
import { AuthService } from "../../auth/auth.service";
// DECORATOR
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
//    posts = [
//     {title: 'First Post', content: 'This is a first post'},
//     {title: 'Second Post', content: 'This is a Second post'},
//     {title: 'Third Post', content: 'This is a Third post'},
//    ];
   posts: Post[] = [];
   
   isLoading = false;
   form: FormGroup;
   totalPosts = 0;
   postsPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1,2,5,10];
   userIsAuthenticated = false;
   userId: string;
   private postsSub: Subscription;
   private authStatusSub: Subscription;
   
   constructor(public postsService: PostsService, private authService: AuthService) {}
    
   ngOnInit(){
        this.form = new FormGroup({
            'title_search':new FormControl(null)
        });
        this.postsService.getPosts(this.postsPerPage,this.currentPage);
        this.userId = this.authService.getUserId();
        this.isLoading = true;
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((postsdata: {posts:Post[],postCount:number})=>{
                this.isLoading = false;
                this.posts = postsdata.posts;
                this.totalPosts = postsdata.postCount;
            });
            this.userIsAuthenticated = this.authService.getIsAuth();
            // const headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' };
            //     axios.get('http://localhost:82/mean-backend/public/api/user',{headers}).then(response=>{
            //         console.log(response);
            //     })
            
            this.userIsAuthenticated = this.authService.getIsAuth();
            this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
   }

   onChangedPage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
   }

   onDelete(postId:string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPage)
    },()=>{
        this.isLoading = false;
    });
   }

   onSearch(){
    this.postsService.onSearch(this.form.value.title_search);
   }
}