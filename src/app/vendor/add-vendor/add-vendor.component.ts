import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DatabaseService} from '../../_services/DatabaseService';
import {SessionStorage} from '../../_services/SessionService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';



@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html'
})
export class AddVendorComponent implements OnInit {
  form: any = {};
  data: any = [];
  contactData: any = [];
  vDealData: any = [];
  productslists: any = [];
  tmp_productslists: any = [];
  states: any = [];
  districts: any = [];
  //cities: any = [];
  cities: Observable<any[]>;
  //pincodes: any = [];
  pincodes: Observable<any[]>;
  myControl: FormControl;
  formData: any = {};
  nexturl: any;
  temp: any;
  sendingData = false;
  loading_list = false;
 
  
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,  public dialog: DialogComponent,public ses: SessionStorage) {       
    

    
  }

  ngOnInit() {
    this.form.country_id = 99;
    this.getStateList();
    this.getCountryList();
    this.getProductlist();
  }

  getProductlist(){ 
  this.loading_list = true;   
  this.db.get_rqst(  '', 'vendors/getProducts')
  .subscribe(data => {  
    this.data = data;
    this.productslists = this.data.data.data; 
    this.tmp_productslists = this.data.data.data; 
    this.loading_list = false;  
    //console.log(this.productslists);
  },err => {console.log(err);   this.loading_list = false; this.dialog.retry().then((result) => { this.getProductlist(); }); });
  }


  search2:any={};
  tmp_search3:any={};
  getPartCheckin(search){

    console.log(search);

     
      this.productslists= [];

      for(var i=0;i<this.tmp_productslists.length; i++)
      {
        search=search.toLowerCase();
        this.tmp_search3 =  this.tmp_productslists[i]['part_number'].toLowerCase();
        if(this.tmp_search3.includes(search))
        {
          this.productslists.push(this.tmp_productslists[i]);
        }
      }
  }

  countries: any = {};
  getCountryList(){
    this.loading_list = true;
    this.db.get_rqst( '', 'consumer_leads/form_options/getcountry')
    .subscribe(data => {

      this.data = data;
      this.countries = this.data.data.countries;
      this.form.country_id = 99;
      // this.getStateList();
      this.loading_list = false;
      console.log (this.countries);
    },err => {console.log(err);   this.loading_list = false; this.dialog.retry().then((result) => { this.getCountryList(); }); }); 
  }

  getStateList(){
    this.loading_list=true;
    if(this.form.country_id == 99){ 
    this.db.get_rqst('', 'vendors/getStates')
    .subscribe(data => {
      this.loading_list= false;  
      this.data = data;
      this.states = this.data.data.states;  
      console.log("states");
      //console.log(this.data);
      console.log(this.states);
    },err => {console.log(err); 
        this.loading_list = false;
        this.dialog.retry().then((result) => { this.getStateList(); }); }); 
   }
  //  this.loading_list= false;  
  }
  getDistrictList(){
    if(this.form.country_id == 99){ 
      this.loading_list = true;
    this.db.post_rqst({'state_name':this.form.state}, 'vendors/getDistrict')
    .subscribe(data => {  
      this.loading_list = false;
      this.data = data;
      this.districts = this.data.data.districts;  
      console.log("District");
      console.log(this.data);
      console.log(this.districts);
    },err => {console.log(err);   this.loading_list = false; this.dialog.retry().then((result) => { this.getDistrictList(); }); }); 
   }
  }
  getCityList(){   
    if(this.form.country_id == 99){ 
      this.loading_list=true;
    this.db.post_rqst({'district_name':this.form.district}, 'vendors/getCity')
    .subscribe(data => {  
      this.loading_list=false;
      this.data = data;
      this.cities = this.data.data.cities;
      this.pincodes = this.data.data.pins;  
      console.log("city & pincodes");
      console.log(this.cities);
      console.log(this.pincodes);
    },err => {console.log(err);   this.loading_list = false; this.dialog.retry().then((result) => { this.getCityList(); }); });
   }
  }
  part_deal:any = 0;
  countPart(){
    this.part_deal = 0;
    for (let i = 0; i < this.productslists.length; i++) {
            if( this.productslists[i].deal ){
              this.part_deal++;
            }
      
    }
  }

  saveVendor() {    

   if(!this.contactData.length)
   {
    this.dialog.warning('Please Add atleast one Contact Info'); 
      return;
   }

   if( !this.part_deal ){
    this.dialog.warning('Please checked atleast one Product'); 
    return;
   }

      this.loading_list = true;
      this.form.created_by =  this.ses.users.id;
      this.form.vcDetailData = this.contactData;
      this.form.vpDealData = this.productslists;

      this.db.insert_rqst( this.form, 'vendors/saveVendors')
        .subscribe(data => {
          this.loading_list = false;

              if(data['data'].msg == 'Exist' ){
                this.dialog.error('gst no. already exists');
                return;
              }
         
            this.dialog.success('Vendor Added Successfully!');
            this.router.navigate(['/vendors']);

          },err => {console.log(err);  this.loading_list = false; this.dialog.retry().then((result) => {  }); });

  }



  




storeVendordetailData(contact_name, mobile1) {
  if(contact_name && (mobile1)) {
     if(Number(mobile1)) {
       this.contactData.push({contact_name: contact_name, mobile1: mobile1});
       this.form.name1 = this.form.mobile1 = this.form.mobile2 = null;
     } else {this.dialog.warning( 'Please Enter a valid Mobile Number');}
   }
   else { this.dialog.warning( 'Please add Contact Name and Mobile to add Vendor Contacts'); }
}
removeVendordetailData(index) {
  this.contactData.splice(index, 1);
} 

active:any={};

toggleterritory(key,action)
{
  console.log(action);
  console.log(key);
  
  if(action == 'open')
  { this.active.user = true; }
  if(action == 'close')
  { this.active.user = false;}

  console.log(this.active);


}


}