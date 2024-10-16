import {Component,OnInit} from '@angular/core'

import { FormControl, FormGroup,Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {Post} from '../post.model';
// DECORATOR
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{
    enteredContent = '';
    enteredTitle = '';
    form: FormGroup;
    private mode = 'create';
    private postId : string;
    post: Post;
    isLoading = false;
    
    constructor(public postsService: PostsService,public route: ActivatedRoute) {}

    ngOnInit(){
        this.form = new FormGroup({
            'title':new FormControl(null,{
                validators:[Validators.required,Validators.minLength(3)]
            }),
            'content':new FormControl(null,{
                validators:[Validators.required,Validators.minLength(3)]
            })
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                // console.log(this.postsService.getPost(this.postId));

                // SPinner
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(
                    postData =>{
                        this.isLoading = false;
                        // this.post = {id:postData.id,title:postData.title,content:postData.content}
                        console.log(postData);
                        this.post = {
                            id:postData._id,
                            title:postData.title,
                            content:postData.content
                        }
                        this.form.setValue(
                            {'title':this.post.title, 'content':this.post.content}
                        )
                    }
                );
                
            }else{
                this.mode = 'create';
                this.postId = 'null';
            }
        });
    }

    onSavePost(){
        if(this.form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create'){
            this.postsService.addPost(this.form.value.title,this.form.value.content)
        }else{
            this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content);
        }
        this.form.reset();
    }
}