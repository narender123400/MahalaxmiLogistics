import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import { ConvertArray } from '../../_Pipes/ConvertArray.pipe';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
})
export class UsersEditComponent implements OnInit {
  user: any = {};
  loading_list:any = false;
  
  sendingData = false;
  constructor(public db: DatabaseService, private route: ActivatedRoute,
    private router: Router,  public dialog: DialogComponent) {
      
    }
    user_id = 0;
    ngOnInit() {

      
      this.user.country_id = '99';
      this.getCountryList();
      this.getStateList();
      // this.getDistrictList(this.user.state);

      this.route.params.subscribe(params => {
        this.user_id = params['id'];
     
      if (this.user_id) { 
        this.getUser();
        this.get_data();
      }
    });
    }
    
    roles: any = [];
    get_data(){
      this.loading_list = true;
  
      this.db.post_rqst(  {'branch_id' : this.db.datauser.branch_id,'consignor_id' : this.db.datauser.consignor_id }, 'franchises/get_rol')
      .subscribe((data:any) => { 
        console.log(data);
        this.roles=data.data.roles;
        console.log(this.roles);
        if(this.roles.country_id == 99)
        {
          this.user.country = 'INDIA';
        }
        this.loading_list = false;
        
      },err => { this.dialog.retry().then((result) => { this.get_data(); });  });
  
    }
    
    getUser(){
      this.loading_list = true;
      this.db.post_rqst(  {'user':  this.user_id }, 'franchises/getUser')
      .subscribe((data:any) => { 
        this.loading_list = false;
        this.temp = data; 
        this.user = this.temp.data.user;
        console.log(this.user);
        
        this.user.role = parseInt( this.temp.data.user.access_level );
        console.log(this.user.role);
        
      },err => { this.dialog.retry().then((result) => { this.getUser(); });  });
    }
    
    
    temp:any = '';
    updateUser(f){
      this.loading_list = true;
      
      
      const tmp = new ConvertArray().transform( f._directives);
      console.log( tmp );
      
      tmp.login_id = this.db.datauser.id;
      tmp.id = this.user.id;
      this.user.country_id = "99";
      tmp.country_id = this.user.country_id;
      
      
      this.db.insert_rqst(  {'user': tmp }, 'franchises/updateUser')
      .subscribe((data:any) => { 
        this.loading_list = false;
        console.log(data);
        
        this.temp = data; 
        if(this.temp.data.msg == 'Success'){
          this.router.navigate(['/users-list']);
        }else if(this.temp.data.msg == 'Exist'){
          this.dialog.error('User already Exist! with same email/username');
        }
      },err => { this.dialog.retry().then((result) => {  });  });
    }
    

    data:any = [];
    email_valid:any = '';
    CheckEmail()
    {
      console.log(this.user);
      console.log(this.user.email);
      this.db.post_rqst({'data':this.user},'franchises/checkexist')
      .subscribe((data:any)=>{
        console.log(data);
        this.data = data;
        this.email_valid = this.data.data.exist;
        console.log(this.email_valid);
      },err => { this.dialog.retry().then((result) => { this.CheckEmail(); });  });
      
      
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
        this.countries = d.data.countries;
        console.log(this.countries);
        this.user.country = this.countries.name;
        
        this.getStateList();
        this.loading_list = false;
      },err => {  this.dialog.retry().then((result) => { 
        this.getCountryList();      
        console.log(err); });  
      }); 
    }
    
    getStateList(){
      this.loading_list = true;
        this.db.get_rqst('', 'vendors/getStates')
        .subscribe(d => {  
          this.loading_list =false;  
          this.states = d.data.states;
          console.log(this.states);
        this.getDistrictList(1);

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
          this.getCityList(1);
        }
        this.db.post_rqst({'state_name':st_name}, 'vendors/getDistrict')
        .subscribe(d => {  
          this.loading_list = false;
          if(val == 1)
          {
            this.districts = d.data.districts;  
            this.getCityList(1);
          }
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
  