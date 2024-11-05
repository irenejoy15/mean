import {Component,OnInit} from '@angular/core'

import { FormControl, FormGroup,Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import {mimeType} from '../post-create/mime-type.validator';
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
    imagePreview:string;
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
            this.postId = paramMap.get('postId');
            
            this.postsService.getPostTest(this.postId).subscribe(
                postData =>{
                    this.isLoading = false;
                    this.data = postData;
                    // this.post = {id:postData.id,title:postData.title,content:postData.content,imagePath:this.data.imagePath}
                    this.post = {
                        id:this.data.id,
                        title:this.data.title,
                        content:this.data.content,
                        imagePath:this.data.imagePath
                    }
                    console.log(this.post.imagePath);
                    this.form.setValue({
                        'title':this.post.title, 
                        'content':this.post.content,
                        'image':this.post.imagePath
                    })
                }
            );
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
    onUpdate(){
        if(this.form.invalid){
            return;
        }
        this.postsService.updatePost(
            this.postId,
            this.form.value.title,
            this.form.value.content,
            this.form.value.image
        );
        // this.form.reset();
    }

}