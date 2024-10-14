import {Component,OnInit} from '@angular/core'

import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {Post} from '../post.model';
// DECORATOR
@Component({
    selector: 'app-post-edit',
    templateUrl: './post-edit.component.html'
})
export class PostEditComponent implements OnInit{
    private postId : string;
    post: Post;
    data:any;
    constructor(public postsService: PostsService,public route: ActivatedRoute) {}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            this.postId = paramMap.get('postId');
          
            this.postsService.getPostTest(this.postId).subscribe(res => {
                this.data =res;
                this.post = this.data;
            });
        });
    }

}