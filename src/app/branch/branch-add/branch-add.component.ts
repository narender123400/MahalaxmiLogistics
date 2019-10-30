import {Component,OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';
import { ConvertArray } from '../../_Pipes/ConvertArray.pipe';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
})
export class BranchAddComponent implements OnInit {

  lead_id;
  loading_list = false;
  franchiseForm: any = {};
  savingData = false;
  temp:any;
  data: any = [];
  franch_stock: any = {};
  accessories: any = [];
  initial_stock: any = [];
  countries: any = [];
  states: any = [];
  districts: any = [];
  cities: any = [];
  corespond = false;
  //cities: Observable<any[]>;
  pincodes: any = [];
  
  corr_districts: any = [];
  corr_pincodes: any = [];
  
  ship_districts: any = [];
  ship_pincodes: any = [];
  franchise_id:any;
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) {
    }
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.franchise_id = params['franchise_id'];
        console.log(this.franchise_id );
      
      if (this.franchise_id) {
        this.get_franchise_detail();
      }
      // this.formOptions();
      //this.get_brand();
      this.franchiseForm.country_id = '99';
      this.franch_stock.franchise_id = '';
      this.getCountryList();
    });
    }
    
    get_franchise_detail(){
      this.db.get_rqst( '', 'branches/detail/'+this.franchise_id)
      .subscribe(data => {
        console.log(data);
        this.franchiseForm = data.getData;
        this.franchiseForm.email = data.getData.email_id;
        this.franchiseForm.pan_no = data.getData.company_pan_no;
        this.franchiseForm.location_id = data.getData.loc_id;
        // this.franchiseForm.pincode = parseInt(data.getData.pincode);
        this.franchiseForm.cors_pincode = parseInt(data.getData.cors_pincode);
        this.franchiseForm.ship_pincode = parseInt(data.getData.ship_pincode);
        if(data.getData.state)
        {
          this.getDistrictList(1);
          this.getCityList(1);
        }

      },err => {  this.dialog.retry().then((result) => { 
        console.log(err); });  
      });
    }
    
    // formOptions() {
    //   this.db.get_rqst( '', 'franchises/country')
    //   .subscribe(data => {
    //     this.data = data;
    //     this.countries = this.data.data.country;        
    //     console.log( this.countries);                
    //     this.refreshFormOption();
    //   },err => {  this.dialog.retry().then((result) => { 
    //     this.formOptions();      
    //     console.log(err); });  
    //   });
    // }

    refreshFormOption() {
      
    }
    
    correspondence_address(e){    
      if(e){
        this.corespond = true;
        this.franchiseForm.cors_country_id = '';
        this.franchiseForm.cors_state = '';
        this.franchiseForm.cors_district = '';
        this.franchiseForm.cors_city = '';
        this.franchiseForm.cors_pincode = '';
        this.franchiseForm.cors_address = '';
      }else{
        this.corespond = false;
        this.franchiseForm.cors_country_id = this.franchiseForm.country_id;
        this.franchiseForm.cors_state = this.franchiseForm.state;
        this.franchiseForm.cors_district = this.franchiseForm.district;
        this.franchiseForm.cors_city = this.franchiseForm.city;
        this.franchiseForm.cors_pincode = this.franchiseForm.pincode;
        this.franchiseForm.cors_address = this.franchiseForm.address;
      }
    }

    clear_plan(){
      if( this.franch_stock.franchise_plan == ''  ){
        this.franch_stock.plan_id = '';
        this.stock = []
        this.plan_data = {}
        this.accessories = [];
      }      
    }
    

    
    saveFranchiseLead(form:any) {
      console.log(this.corespond);
      this.savingData = true;

      console.log(form);
      
      const tmp = new ConvertArray().transform( form._directives);
      if(this.corespond == false)
      {
        tmp.cors_country_id = tmp.country_id;
        tmp.cors_state = tmp.state;
        tmp.cors_district = tmp.district;
        tmp.cors_city = tmp.city;
        tmp.cors_pincode = tmp.pincode;
        tmp.cors_address = tmp.address;
      }
      console.log( tmp );
      this.savingData = true;
      tmp.type = '2';
      tmp.edit_franchise_id = this.franchise_id;
      tmp.created_by = this.ses.users.id;

      tmp.training_start = tmp.training_start ? this.db.pickerFormat(tmp.training_start) :'';
      tmp.training_end = tmp.training_end  ? this.db.pickerFormat(tmp.training_end) : '';
      tmp.associated_date =   tmp.associated_date ? this.db.pickerFormat(tmp.associated_date) : '';

      this.db.insert_rqst( {'tmp':tmp}, 'branches/add')
      .subscribe(data => {
        this.savingData = false;

        if(data['data'].msg == 'Success' ){
          
          if(data['data'].msg == 'Success')
          {
            console.log("iff");
            console.log(this.franchise_id);
            
            this.router.navigate(['branch-detail/'+ data['data'].id]);
          }
          else{
            this.temp = data;
            console.log( this.temp );
            if (this.temp.data.franchise_id) {
              this.franch_stock.franchise_id = this.temp.data.franchise_id;
            }
          }

          this.dialog.success( 'Franchise successfully updated');

        }else if(data['data'].msg == 'Exist' ){
            this.dialog.error( 'Email already exists');

        }else{
            this.dialog.error( 'Problem occured ');
            
        }

     
      },err => {  this.dialog.retry().then((result) => { 
        this.saveFranchiseLead(form);      
        console.log(err); });  
      });
    }
    
    
    
    plan_data: any = {};
    stock: any = [];
    get_stock() {
      console.log(this.franch_stock.plan_id);
      this.loading_list = false;
      this.db.get_rqst( '', 'franchises/get_stock/' + this.franch_stock.plan_id)
      .subscribe(data => {
        this.data = data;
        console.log(data);
        this.loading_list = true;
        this.stock = this.data.data.data;
        this.plan_data = this.data.data.plans;
        this.accessories = this.data.data.accessories;
        console.log(this.accessories);        
      },err => {  this.dialog.retry().then((result) => { 
        this.get_stock();      
        console.log(err); });  
      });
    }
    
    remove(i:any,x:any) {
      console.log(this.stock[i][0]);
      this.stock[i][0].splice(x,1);
    }
    
    delete_product(i:any) {
      console.log(this.stock[i]);
      this.stock.splice(i,1);
      console.log(this.stock);
      
    }
    


    
    submit_initial_stock(){
      console.log( this.stock );
      this.savingData = true;

 


      console.log(this.ses.users);      
      this.db.post_rqst( {'franchise_id': this.franch_stock.franchise_id,'login_id': this.ses.users.id, 'plan_data': this.plan_data, 'isPlanSelected': this.franch_stock.franchise_plan, 'accessories': this.accessories, 'stock': this.stock } , 'franchises/addInitialStock')
      .subscribe(data => {
        console.log(data);        
        this.savingData = false;
        this.router.navigate(['/franchise-list']);        
      },err => { 
        this.dialog.retry().then((result) => { 
        this.submit_initial_stock();      
        console.log(err); });  
      }); 
    }
    
    getCountryList(){
      this.loading_list = false;
      this.db.get_rqst( '', 'consumer_leads/form_options/getcountry')
      .subscribe(data => {
        this.data = data;
        this.countries = this.data.data.countries;
        this.franchiseForm.country_id = 99;
        this.franchiseForm.cors_country_id = 99;  
        this.franchiseForm.ship_country_id = 99;       
        this.getStateList();
        this.loading_list = true;
        console.log(this.data);
      },err => {  this.dialog.retry().then((result) => { 
        this.getCountryList();      
        console.log(err); });  
      }); 
    }
    
    getStateList(){
      this.loading_list = false;
      if(this.franchiseForm.country_id == 99){ 
        this.db.get_rqst('', 'vendors/getStates')
        .subscribe(data => {  
          this.data = data;
          this.states = this.data.data.states;
          this.loading_list = true;  
          console.log("states");
          //console.log(this.data);
          console.log(this.states);
        },err => {  this.dialog.retry().then((result) => { 
          this.getStateList();      
          console.log(err); });  
        });
      }
    }
    getDistrictList(val){
      if(this.franchiseForm.country_id == 99){ 
        this.loading_list = false;
        let st_name;
        if(val == 1)
        {
          st_name = this.franchiseForm.state;
        }
        else if(val == 1)
        {
          st_name = this.franchiseForm.cors_state;
        }
        else
        {
          st_name = this.franchiseForm.ship_state;
        }
        this.db.post_rqst({'state_name':st_name}, 'vendors/getDistrict')
        .subscribe(data => {  
          this.data = data;
          this.loading_list = true;
          if(val == 1)
          {
            this.districts = this.data.data.districts;  
          }
          else if(val == 2)
          {
            this.corr_districts = this.data.data.districts;  
          }
          else
          {
            this.ship_districts = this.data.data.districts;  
          }
          console.log("District");
          console.log(this.data);
          console.log(this.districts);
          console.log(val);
          console.log(this.franchiseForm);
        },err => {  this.dialog.retry().then((result) => { 
          this.getDistrictList(val);      
          console.log(err); });  
        });
      }
    }
    getCityList(val){   
      if(this.franchiseForm.country_id == 99){ 
        this.loading_list = false;
        let dist_name;
        if(val == 1)
        {
          dist_name = this.franchiseForm.district;
        }
        else if(val == 1)
        {
          dist_name = this.franchiseForm.cors_district;
        }
        else
        {
          dist_name = this.franchiseForm.ship_district;
        }
        console.log(dist_name);
        
        this.db.post_rqst({'district_name':dist_name}, 'vendors/getCity')
        .subscribe(data => {  
          this.data = data;
          console.log(this.data);
          
          this.loading_list = true;
          this.cities = this.data.data.cities;
          if(val == 1)
          {
            this.pincodes = this.data.data.pins;  
          }
          else if(val == 2)
          {
            this.corr_pincodes = this.data.data.pins;  
          }
          else
          {
            this.ship_pincodes = this.data.data.pins;  
          }
          console.log("city & pincodes");
          console.log(this.cities);
          console.log(this.pincodes);
        },err => {  this.dialog.retry().then((result) => { 
          this.getCityList(val);      
          console.log(err); });  
        });
      }
    }
    



    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      // console.log(event.keyCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    
  }