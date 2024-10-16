import {Component,OnInit} from '@angular/core'

import { FormControl, FormGroup,Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {Post} from '../post.model';
// DECORATOR
@Component({
    selector: 'app-post-edit',
    templateUrl: './post-edit.component.html',
    styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent implements OnInit{
    private postId : string;
    post: Post;
    data:any;
    form: FormGroup;
    isLoading:false;
    constructor(public postsService: PostsService,public route: ActivatedRoute) {}

    ngOnInit(){
        this.form = new FormGroup({
            'title':new FormControl(null,{
                validators:[Validators.required,Validators.minLength(3)]
            }),
            'content':new FormControl(null,{
                validators:[Validators.required,Validators.minLength(3)]
            }),
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            this.postId = paramMap.get('postId');
            
            this.postsService.getPostTest(this.postId).subscribe(
                postData =>{
                    this.isLoading = false;
                    this.data = postData;
                  
                    // this.post = {id:postData.id,title:postData.title,content:postData.content}
                    this.post = {id:this.data.id,title:this.data.title,content:this.data.content}
                    this.form.setValue(
                        {'title':this.post.title, 'content':this.post.content}
                    )
                }
            );
        });
        
        
    }

    onUpdate(){
        this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content);
        this.form.reset();
    }

}