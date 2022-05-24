import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { MatModule } from '../mat/mat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    UsersComponent,
    AddEditUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ], 
  providers: []
})
export class UsersModule { }
