import {Component, OnDestroy, OnInit} from '@angular/core'
import { Subscription } from 'rxjs';
import {Post} from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup,Validators } from '@angular/forms';
// DECORATOR
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy{
//    posts = [
//     {title: 'First Post', content: 'This is a first post'},
//     {title: 'Second Post', content: 'This is a Second post'},
//     {title: 'Third Post', content: 'This is a Third post'},
//    ];
   posts: Post[] = [];
   private postsSub : Subscription;
   isLoading = false;
   form: FormGroup;
   totalPosts = 0;
   postsPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1,2,5,10];

   constructor(public postsService: PostsService) {}
    
   ngOnInit(){
        this.form = new FormGroup({
            'title_search':new FormControl(null)
        });
        this.postsService.getPosts(this.postsPerPage,this.currentPage);
        this.isLoading = true;
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((postsdata: {posts:Post[],postCount:number})=>{
                this.isLoading = false;
                this.posts = postsdata.posts;
                this.totalPosts = postsdata.postCount;
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
   }

   onDelete(postId:string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPage)
    });
   }

   onSearch(){
    this.postsService.onSearch(this.form.value.title_search);
   }
}