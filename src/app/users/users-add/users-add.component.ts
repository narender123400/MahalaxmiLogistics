import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import { ConvertArray } from '../../_Pipes/ConvertArray.pipe';


@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
})
export class UsersAddComponent implements OnInit {
user: any = {};

  sendingData = false;
  constructor(public db: DatabaseService, private route: ActivatedRoute,
              private router: Router,  public dialog: DialogComponent) {
  }
  ngOnInit() {
    this.get_data();

    // this.user.country_id = '99';
    this.getCountryList();
    this.getStateList();
  }

  loading_list = false;

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
  
temp:any='';
  saveUser(f){
    this.loading_list = true;

         
    const tmp = new ConvertArray().transform( f._directives);
    console.log( tmp );
    
    tmp.login_id = this.db.datauser.id;
    tmp.branch_id = this.db.datauser.branch_id || 0;
    tmp.consignor_id = this.db.datauser.consignor_id || 0;
    this.user.country_id = "99";
    tmp.country_id = this.user.country_id;

    this.db.insert_rqst(  {'user': tmp }, 'franchises/saveUser')
    .subscribe((data:any) => { 
    this.loading_list = false;

      this.temp = data; 
      if(this.temp.data.msg == 'Success'){
        this.router.navigate(['/users-list']);
      }else if(this.temp.data.msg == 'Exist'){
        this.dialog.error('User already Exist! with same email/username');
      }
      },err => { this.dialog.retry().then((result) => {  this.loading_list = false;  });  });
   
  }
  countries :any = {};
  states :any = [];
  pincodes :any = [];
  cities :any = [];
  districts :any = [];
  getCountryList(){
    this.loading_list = true;
    this.db.get_rqst( '', 'consumer_leads/form_options/getcountry')
    .subscribe(d => {
      this.loading_list = false;
      this.countries = d.data.countries;
      this.user.country_id = this.countries.name;
      console.log( this.user.country_id);
      
      this.getStateList();
    },err => {  this.dialog.retry().then((result) => { 
      this.getCountryList();      
      console.log(err); });  
    }); 
  }
  
  getStateList(){
    this.loading_list = true;
      this.db.get_rqst('', 'vendors/getStates')
      .subscribe(d => {  
        this.states = d.data.states;
        this.loading_list =false; 

        console.log(this.states);

      },err => {  this.dialog.retry().then((result) => { 
        this.getStateList();      
        console.log(err); });  
      });
  }
  getDistrictList(val){
      this.loading_list = true;
      let st_name;
      if(val == 1)
      {
        st_name = this.user.state;
      }
      this.db.post_rqst({'state_name':st_name}, 'vendors/getDistrict')
      .subscribe(d => {  
        this.loading_list = false;
        if(val == 1)
        {
          this.districts = d.data.districts;  
        }

        console.log(this.districts);
      },err => {  this.dialog.retry().then((result) => { 
        this.getDistrictList(val);      
        console.log(err); });  
      });
  }
  getCityList(val){   
      this.loading_list = true;
      let dist_name;
      if(val == 1)
      {
        dist_name = this.user.district;
      }
      this.db.post_rqst({'district_name':dist_name}, 'vendors/getCity')
      .subscribe(d => {  

        this.loading_list = false;
        this.cities = d.data.cities;
        if(val == 1)
        {
          this.pincodes = d.data.pins;  
        }
      
        console.log(this.cities);
        console.log(this.pincodes);
      },err => {  this.dialog.retry().then((result) => { 
        this.getCityList(val);      
        console.log(err); });  
      });
  }
  


}
