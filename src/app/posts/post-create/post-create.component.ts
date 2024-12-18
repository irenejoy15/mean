import {Component,OnInit} from '@angular/core'

import { FormControl, FormGroup,Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './mime-type.validator';
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
    imagePreview: string;
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
            }),
            'image':new FormControl(null,{
                validators:[Validators.required],
                asyncValidators: [mimeType]
            }),
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
                            content:postData.content,
                            imagePath:postData.imagePath,
                        }
                        this.form.setValue({
                            'title':this.post.title,
                            'content':this.post.content,
                            'image':this.post.imagePath,
                        })
                    }
                );
                
            }else{
                this.mode = 'create';
                this.postId = 'null';
            }
        });
    }

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        // SINGLE CONTROL
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    onSavePost(){
        if(this.form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create'){
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }else{
            this.postsService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        this.form.reset();
    }
}