import {Component, OnDestroy, OnInit} from '@angular/core'
import { Subscription } from 'rxjs';
import {Post} from '../post.model';
import { PostsService } from '../post.service';
import { NgForm } from '@angular/forms';
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
   
   constructor(public postsService: PostsService) {}

   ngOnInit(){
       this.postsService.getPosts();
       this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[])=>{
            this.posts = posts;
        });
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
   }

   onDelete(postId:string){
    this.postsService.deletePost(postId);
   }

   onSearch(form:NgForm){
    this.postsService.onSearch(form.value.title_search);
   }
}