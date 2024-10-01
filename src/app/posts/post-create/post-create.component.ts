import {Component} from '@angular/core'
// DECORATOR
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent{
    enteredValue = '';
    newPost = 'NO CONTENT';
    onAddPost(){
        this.newPost = this.enteredValue;
    }
}