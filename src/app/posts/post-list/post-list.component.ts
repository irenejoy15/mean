import {Component,Input} from '@angular/core'
import {Post} from '../post.model';
import { PostsService } from '../post.service';
// DECORATOR
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent{
//    posts = [
//     {title: 'First Post', content: 'This is a first post'},
//     {title: 'Second Post', content: 'This is a Second post'},
//     {title: 'Third Post', content: 'This is a Third post'},
//    ];
   @Input() posts: Post[] = [];

   constructor(public postsService: PostsService) {}
}