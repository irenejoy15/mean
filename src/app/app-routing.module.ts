import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostEditComponent } from "./posts/post-edit/post-edit.component";
const routes : Routes= [
    {path:'', component: PostListComponent},
    {path:'create', component: PostCreateComponent},
    {path:'edit/:postId', component: PostCreateComponent},
    {path:'test/edit/:postId', component:PostEditComponent}
];

@NgModule({
   imports:[RouterModule.forRoot(routes)],
   exports:[RouterModule]
})
export class AppRoutingModule {

}