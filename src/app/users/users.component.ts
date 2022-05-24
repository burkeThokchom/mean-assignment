import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './users.service';
import Swal from 'sweetalert2';
import  debounce from 'lodash.debounce';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  links: any = [];
  user: any;
  updateAppearence:boolean =  false;
  searchValue:string = "";

  isLoading: boolean = false;
  isTyped: boolean = false;
  page: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  pageSize: number = 5;
  totalItems: number = 0;
  dataSourceUser: MatTableDataSource<any> | undefined;
  displayColumns: string[] = [
    "First Name",
    "Last Name",
    "Email",
    "Address",
    "Contact", 
    "Education",
    "Actions"
  ]

  constructor(
    private dialog: MatDialog,
    private _usersService: UsersService
  ) { }

  ngOnInit(): void {
   this.getAllUsers();
  }

  handleKeyPress(){
    if(this.searchValue === ""){
      this.isTyped = false;
    }
    else{
      this.isTyped = true;
    }
    this.debouncer();
  }

  debouncer = debounce(this.getAllUsers, 500);

  getPaginationParams(){
    return {
      page: this.page,
      pageSize: this.pageSize,
      searchValue: this.searchValue
    }
  }

  addUser(){
   const dialogRef = this.dialog.open(AddEditUserComponent, {
      maxHeight: "90vh",
      width: "800px",
      panelClass: ["custom-add-user"],
      data: {
        isEdit: false
      }
    })
    dialogRef.afterClosed().subscribe((status:boolean)=>{
      if(status){
        this.getAllUsers();
      }
    })
  }

  getAllUsers(){
    const query = this.getPaginationParams();
    this.isLoading = true;
    this._usersService.getAllUsers(query)
    .subscribe((res:any)=>{
      this.isLoading = false;
      if(res["data"][0]['data'].length > 0){
        const formattedUserData = res["data"][0]["data"].map((user:any)=>{
          return {...user}
        });
        //const formattedUserData = res.data
        this.dataSourceUser = new MatTableDataSource(formattedUserData);
        this.totalItems =  res["data"][0]["count"][0]["count"];
        //this.totalItems =  res.data.length
      }

    }, (error:any)=>{
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error while fetching users!'
      })
    })

  }

  popupEditModal(userData:any){
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      maxHeight: "90vh",
      width: "800px",
      panelClass: ["custom-add-user"],
      data: {
        isEdit: true,
        userData
      }
    })

    dialogRef.afterClosed().subscribe((status:boolean)=>{
      if(status){
        this.getAllUsers();
      }
    })
  }

  openDeleteModal(userId:string){
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      maxHeight: "90vh",
      width: "800px",
      panelClass: ["custom-add-user"],
      data: {
        isDelete: true,
        userId
      }
    })

    dialogRef.afterClosed().subscribe((status:boolean)=>{
      if(status){
        this.getAllUsers();
      }
    })
  }

  onPageEvent(event:any){
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getAllUsers();
  }
}
