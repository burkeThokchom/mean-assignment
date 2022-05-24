import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  addUserForm: FormGroup;
  contactFormArray: FormArray;
  educationalFormArray: FormArray;
  isLoading: boolean = false;
  userData: any = {};
  constructor(
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { 
    this.addUserForm = this._formBuilder.group({
      firstName: ["", Validators.required], 
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      address: this._formBuilder.group({
        address_line_1: ["", Validators.required],
        address_line_2: ["", Validators.required],
        city: ["", Validators.required],
        zipcode: ["", Validators.required],
        state: ["", Validators.required]
      }),
      contact: new FormArray([]),
      eduProgress: this._formBuilder.array([])

    })

    this.contactFormArray = (<FormArray>this.addUserForm.get("contact"));
    this.educationalFormArray = (<FormArray>this.addUserForm.get("eduProgress"));
  }

  ngOnInit(): void {
    if(this.data.isEdit && this.data.userData){
      this.getData();
    }
  }

  getData(){
    this.isLoading  = true;
    this._usersService.getUserById(this.data.userData._id)
    .subscribe((user:any)=>{
      this.isLoading  = false;
      if(user && user._id){
        this.userData = user;
        this.setFormData();
      }
    }, (error:any)=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message ? error.message : 'Error while getting user!'
      })
    })
  }

  setFormData(){
    this.addUserForm.controls['firstName'].setValue(this.userData.firstName);
    this.addUserForm.controls['lastName'].setValue(this.userData.lastName);
    this.addUserForm.controls['email'].setValue(this.userData.email);
    this.addUserForm.controls['address'].setValue(this.userData.address);
    if(this.userData.contact.length > 0){
      this.userData.contact.forEach((num:number)=>{
        this.loadContactForm();
       
      })
      this.addUserForm.controls['contact'].setValue(this.userData.contact)
    }
    if(this.userData.eduProgress.length > 0){
      this.userData.eduProgress.forEach((num:string)=>{
        this.loadEducationForm();
       
      })
      this.addUserForm.controls['eduProgress'].setValue(this.userData.eduProgress)
    }

  }

  addEducationFormGroup(){
    return this._formBuilder.group({
      score: ["", Validators.required],
      class: ["", Validators.required],
      school: ["", Validators.required]
    })
  }

  loadContactForm(){
  this.contactFormArray.push(new FormControl())
    this.cdr.detectChanges();
  }
  loadEducationForm(){
    (<FormArray>this.addUserForm.get("eduProgress")).push(
      this.addEducationFormGroup()
    )
    this.cdr.detectChanges();
  }

  removeContact(contactIndex:number){
    this.contactFormArray.removeAt(contactIndex);
    this.cdr.detectChanges();
  }

  removeEducationForm(eduIndex:number){
    this.educationalFormArray.removeAt(eduIndex);
    this.cdr.detectChanges();
  }

  saveUser(){
    const formData= this.addUserForm.getRawValue();
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      address: formData.address,
      contact: formData.contact.map((num:string)=> num.trim()),
      eduProgress: formData.eduProgress.map((educ:any)=> {
        return { score: parseInt(educ.score), class: educ.class.toString().trim(), school: educ.school.trim()}
      })
    };
    this.isLoading = true;
    if(this.data.isEdit === true && this.data.userData){
      userData['_id'] = this.data.userData._id;
      this._usersService.updateUser(userData)
      .subscribe((res:any)=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Great Success!',
          text: 'User Updated Successfully',
          imageUrl: 'https://unsplash.it/400/200',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
        })
        this.dialogRef.close(true)
      }, error=>{
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message ? error.message : 'Error while updating user!'
        })
      })
    }
    else{
      this._usersService.createUser(userData)
      .subscribe((res:any)=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Great Success!',
          text: 'User Added Successfully',
          imageUrl: 'https://unsplash.it/400/200',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
        })
        this.dialogRef.close(true)
      }, error=>{
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message ? error.message : 'Error while adding user!'
        })
      })
    }

  }

  closeDialog(){
    this.dialogRef.close()
  }

  deleteUser(){
    if(this.data.isDelete && this.data.userId){
      this.isLoading = true;
      this._usersService.deleteUser(this.data.userId)
      .subscribe((res:any)=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Great Success!',
          text: 'User Deleted Successfully',
          imageUrl: 'https://unsplash.it/400/200',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
        })
        this.dialogRef.close(true)
      }, (error:any)=>{
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error while deleting user!'
        })
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User Id is undefined!'
      })
    }

  }
}
