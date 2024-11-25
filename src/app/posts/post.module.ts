import { NgModule } from "@angular/core";
import { PostEditComponent } from './post-edit/post-edit.component';
import {PostListComponent } from './post-list/post-list.component';
import {PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/angular.module";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
@NgModule({
    declarations:[
        PostListComponent,
        PostEditComponent,
        PostCreateComponent,
    ],
    imports:[
        ReactiveFormsModule,
        AngularMaterialModule,
        CommonModule,
        RouterModule
    ]
})
export class PostModule {}