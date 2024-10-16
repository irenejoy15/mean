import {Component, OnDestroy, OnInit} from '@angular/core'
import { Subscription } from 'rxjs';
import {Post} from '../post.model';
import { PostsService } from '../post.service';
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
   constructor(public postsService: PostsService) {}
    
   ngOnInit(){
        this.form = new FormGroup({
            'title_search':new FormControl(null)
        });
       this.postsService.getPosts();
       this.isLoading = true;
       this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[])=>{
            this.isLoading = false;
            this.posts = posts;
        });
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
   }

   onDelete(postId:string){
    this.postsService.deletePost(postId);
   }

   onSearch(){
    this.postsService.onSearch(this.form.value.title_search);
   }
}