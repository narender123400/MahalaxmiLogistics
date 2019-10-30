import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import { ConvertArray } from '../../_Pipes/ConvertArray.pipe';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  user: any = {};
  loading_list = false;
  isInvoiceDataExist = false;
  current_page = 1;
  last_page: number ;
  totaluser;
  searchData = true;

  sendingData = false;
  constructor(public db: DatabaseService, private route: ActivatedRoute,
              private router: Router,  public dialog: DialogComponent) {
  }
  ngOnInit() {
    this.get_data();
    this.usersList();
  }

  redirect_previous() {
    this.current_page--;
    this.usersList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.usersList();
  }

  
  roles: any = [];
  get_data(){
    this.loading_list = true;

    this.db.post_rqst(  {'branch_id' : this.db.datauser.branch_id,'consignor_id' : this.db.datauser.consignor_id }, 'franchises/get_rol')
    .subscribe((data:any) => { 
      console.log(data);
      this.roles=data.data.roles;
      console.log(this.roles);
      this.loading_list = false;
      
    },err => { this.dialog.retry().then((result) => { this.get_data(); });  });

  }



  truncate(){
    this.loading_list = true;

    this.db.post_rqst( '' , 'sales/truncate')
    .subscribe((data:any) => { 
     
      this.loading_list = false;
      
    },err => {   });

  }

  branchStock(){
    this.loading_list = true;

    this.db.post_rqst( '' , 'sales/branchsetStock')
    .subscribe((data:any) => { 
     
      this.loading_list = false;
      
    },err => {   });

  }

  update_data(){
    this.loading_list = true;

    this.db.post_rqst( '' , 'sales/update_data')
    .subscribe((data:any) => { 
     
      this.loading_list = false;
      
    },err => {   });

  }



filter:any = {};
temp:any='';
d:any={};
users: any = [];
search: any = '';
filtering:any = false;

usersList(){

         
  this.isInvoiceDataExist = false;
    this.loading_list = true;
          
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';

    
    if( this.filter.date || this.filter.search || this.filter.status)this.filtering = true;

    
    this.d.branch_id = this.db.datauser.branch_id || 0;
    this.d.consignor_id = this.db.datauser.consignor_id || 0;
    this.d.s = this.search;
    console.log(this.d);


    
    if( this.filter.access_level )this.filtering = true;

    
    console.log(this.filter);

    this.db.post_rqst(  {'filter' : this.filter,'user':  this.d , 'login': this.db.datauser }, 'franchises/usersList?page=' + this.current_page)
    .subscribe((d:any) => { 
     this.loading_list = false;
      this.users = d.users.data;
      this.current_page = d.users.current_page;
        this.last_page = d.users.last_page;
        if (this.search && (this.users.length < 1)) { this.searchData = false; }
        if (this.search && (this.users.length > 0)) { this.searchData = true; }
        
    console.log(this.users);
    
    },err => {  this.dialog.retry().then((result) => { this.usersList(); });   });
}




deleteUser(id){
  this.dialog.delete('User').then((result) => {
    if(result) {
         
  this.loading_list = true;

    this.db.post_rqst(  {'user':  id }, 'franchises/userDelete')
    .subscribe((data:any) => { 
  this.loading_list = false;
    this.usersList();
    },err => {  this.dialog.retry().then((result) => { this.deleteUser(id); });   });

    }
  });
}



}
