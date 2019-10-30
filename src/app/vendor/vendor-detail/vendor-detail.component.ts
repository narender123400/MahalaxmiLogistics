import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';



@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent implements OnInit {
  form: any = {};
  data: any = [];
  data1: any = [];
  myControl: FormControl;
  active:any = {};
  vendor_id;
  vendor_name;
  pr_id;
  pr_nm;
  purchase_all_count = 0;
  purchase_pending_count = 0;
  purchase_reject_count = 0;
  purchase_receive_count = 0;
  vendor: any = [];
  vendor_con: any = [];
  vendor_deal: any = [];
  vendor_redeal: any = [];

  tmp_vendor_deal: any = [];
  tmp_vendor_redeal: any = [];

  vendor_purchase: any = [];
  usernam: any = [];
  itemnam: any = [];
  formData: any = {};
  loading_list = false;
  enable_email = false;
  enable_name = false;
  enable_contact = false;
  enable_landline = false;  
  enable_address = false;
  enable_country = false;
  enable_state = false;
  enable_district = false;
  enable_city = false;
  enable_pin_code = false;
  enable_pan_no = false;
  enable_gst_no = false;
  enable_company_name = false;
  enable_meterial_type = false;
  enable_gst_percentage = false;
  enable_hsn_code = false;
  current_deal = true;
  remaining_deal = false;
  enable_all_po = false;
  enable_pending_po = true;
  enable_receive_po = false;
  enable_cancel_po = false;
  countries: any = [];
  states: any = [];
  districts: any = [];
  cities: any = [];
  pincodes: any = [];
  nexturl: any = [];

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router,
    public matDialog: MatDialog,  public dialog: DialogComponent) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vendor_id = params['id'];
    
    if (this.vendor_id) {
       this.getVendorDetails(this.vendor_id); 
       
    }   
  }); 
    //console.log(this.vendor_id);
  }


  getVendorDetails(vendor_id) {
    //console.log(vendor_id);
    
    this.db.get_rqst(  '', 'vendors/vendorDetails/' + vendor_id)
      .subscribe(data => {
        this.data = data;
        console.log("vendor data");
        console.log(data);
        this.vendor = data['data']['data'][0];
        this.vendor_con = data['data']['v_con'];
        this.vendor_deal = data['data']['v_cdeal'];
        this.vendor_redeal = data['data']['v_rdeal']; 
        
        this.tmp_vendor_deal = data['data']['v_cdeal'];
        this.tmp_vendor_redeal = data['data']['v_rdeal'];

        this.vendor_purchase = data['data']['v_purchase'];
        this.purchase_all_count = data['data']['v_purchase_all'];
        this.purchase_pending_count = data['data']['v_purchase_pending'];
        this.purchase_receive_count = data['data']['v_purchase_receive'];
        this.purchase_reject_count = data['data']['v_purchase_reject']; 
        this.usernam = data['data']['usernam']; 
        this.itemnam = data['data']['v_purchase_item'];
        // console.log(this.purchase_all_count);
        // console.log(this.purchase_pending_count);
        // console.log(this.purchase_reject_count);
        // console.log(this.purchase_received_count);
        //console.log(this.vendor_con);
        //console.log(this.vendor_deal);
        //console.log(this.vendor_redeal);
        //console.log(this.usernam);
        //console.log(this.vendor);
        this.form.name = this.vendor.name;
        this.form.mobile = this.vendor.phone;
        this.form.email = this.vendor.email_id;
        this.form.address = this.vendor.address;
        this.form.country = parseInt(this.vendor.country);
        this.form.state = this.vendor.state;
        this.form.district = this.vendor.district;  
        this.form.city = this.vendor.city;        
        this.form.pin = this.vendor.pin_code;      
        this.form.landline = this.vendor.landline;        
        this.form.gst = this.vendor.gst_no;
        this.form.pan = this.vendor.pan_no;
        this.form.company_name = this.vendor.company_name;
        this.form.meterial_type = this.vendor.meterial_type;
        this.form.hsn_code = this.vendor.hsn_code;
        this.form.gst_no = this.vendor.gst_no;
        this.form.gst_percentage = this.vendor.gst_percentage;

        this.form.bank_name = this.vendor.bank_name;
        this.form.bank_ac_no = this.vendor.bank_ac_no;
        this.form.beneficiary_name = this.vendor.beneficiary_name;
        this.form.branch_name = this.vendor.branch_name;
        this.form.IFSC_code = this.vendor.IFSC_code;

        this.form.pin = this.vendor.pin_code; 
        
        this.getCountryList(); 
        if(this.form.country==99){
          this.getStateList();   
          this.getDistrictList(); 
          this.getCityList();
        }  
        
        this.loading_list = true;        
      },err => { this.dialog.retry().then((result) => { this.getVendorDetails(vendor_id); }); });
  }


  search2:any={};
  tmp_search3:any={};
  getPartCheckin(mode,search){
console.log(search);

    if(mode == 'mode2')
    { 
      this.vendor_redeal= [];

      for(var i=0;i<this.tmp_vendor_redeal.length; i++)
      {
        // if(search!)
        search=search.toLowerCase();
        this.tmp_search3 =  this.tmp_vendor_redeal[i]['part_number'].toLowerCase();
        if(this.tmp_search3.includes(search))
        {
          this.vendor_redeal.push(this.tmp_vendor_redeal[i]);
        }
      }
      console.log();
    }

    if(mode == 'mode1')
    { 
      this.vendor_deal= [];

      for(var i=0;i<this.tmp_vendor_deal.length; i++)
      {
        search=search.toLowerCase();
        this.tmp_search3 =  this.tmp_vendor_deal[i]['part_number'].toLowerCase();
        if(this.tmp_search3.includes(search))
        {
          this.vendor_deal.push(this.tmp_vendor_deal[i]);
        }
      }
    }
   


    
  }



  disableFields() {
    //alert(this.enable_landline);
    this.enable_email = false;
    this.enable_name = false;
    this.enable_contact = false;
    this.enable_landline = false;  
    this.enable_address = false;
    this.enable_country = false;
    this.enable_state = false;
    this.enable_district = false;
    this.enable_city = false;
    this.enable_pin_code = false;
    this.enable_pan_no = false;
    this.enable_gst_no = false;
    this.enable_company_name = false;
    this.enable_meterial_type = false;
    this.enable_gst_percentage = false;
    this.enable_hsn_code = false;
  }

  updateVendor(){ 
    this.loading_list = false;
    this.formData.vendor_id = this.vendor_id;
    this.formData.email = this.form.email?this.form.email:'';
    this.formData.landline = this.form.landline?this.form.landline:'';
    this.formData.address = this.form.address?this.form.address:'';
    this.formData.country =  this.form.country?this.form.country:'';
    this.formData.state = this.form.state?this.form.state:'';
    this.formData.district = this.form.district?this.form.district:'';
    this.formData.city = this.form.city?this.form.city:'';
    this.formData.pin =  this.form.pin?this.form.pin:'';
    this.formData.pan_no = this.form.pan?this.form.pan:'';
    this.formData.gst_no = this.form.gst_no?this.form.gst_no:'';
    this.formData.mobile = this.form.mobile?this.form.mobile:'';
    this.formData.gst_percentage = this.form.gst_percentage?this.form.gst_percentage:'';
    this.formData.meterial_type = this.form.meterial_type?this.form.meterial_type:'';
    this.formData.company_name = this.form.company_name?this.form.company_name:'';
    this.formData.hsn_code = this.form.hsn_code?this.form.hsn_code:'';
    
    

    this.db.post_rqst(this.formData, 'vendors/update').subscribe(r => {
        this.loading_list = true;
          if(r['msg'] == 'Blank' ){
            this.dialog.warning('Company Name Required!');
            return;
          }
        
          if(r['msg'] == 'Exist' ){
            this.dialog.success('Vendor already exists!');
            return;
          }

          this.getVendorDetails(this.vendor_id);
          this.disableFields();
          this.dialog.success('Success');
         
        } ,err => { this.dialog.retry().then((result) => { this.updateVendor(); }); });   
  }
  
  getCountryList(){
    this.db.get_rqst( '', 'consumer_leads/form_options/getcountry')
    .subscribe(data => {
      this.data = data;
      this.countries = this.data.data.countries;
      this.getStateList();
    }, error => {
    }); 
  }

  getStateList(){
    this.db.get_rqst('', 'vendors/getStates')
    .subscribe(data => {  
      this.data = data;
      this.states = this.data.data.states;  
      console.log("states");
      //console.log(this.data);
      console.log(this.states);
      });
  }
  getDistrictList(){
    this.db.post_rqst({'state_name':this.form.state}, 'vendors/getDistrict')
    .subscribe(data => {  
      this.data = data;
      this.districts = this.data.data.districts;  
      console.log("District");
      console.log(this.data);
      console.log(this.districts);
      });
  }
  getCityList(){   
    this.db.post_rqst({'district_name':this.form.district}, 'vendors/getCity')
    .subscribe(data => {  
      this.data = data;
      this.cities = this.data.data.cities;
      this.pincodes = this.data.data.pins;  
      console.log("city & pincodes");
      console.log(this.cities);
      console.log(this.pincodes);
      });
  }

  contact_person:any = {};
  update_vendor_contact(index:any)
  {
    this.loading_list = false;
    console.log(index);
    this.contact_person = this.vendor_con[index];
    console.log(this.contact_person);    
    this.db.post_rqst(this.contact_person, 'vendors/vendor_contact_update').subscribe(result => {    
      console.log(result);
      this.loading_list = true;
      if(result['msg'] == "success")
      {        
        this.getVendorDetails(this.vendor_id);
      }     
    },error=>{
      console.log(error);        
    });
    this.active = {};
  }
  deal_pro_id:any = {};
  update_vendor_deal_add(pr_id,pr_nm){
    this.loading_list = false; 
      this.deal_pro_id = {
        id: pr_id,
        part_number: pr_nm,
        vendor_id: this.vendor.id
      };
      console.log(this.deal_pro_id);
      this.db.post_rqst(this.deal_pro_id, 'vendors/vendor_deal_add').subscribe(result => {    
      console.log(result);
      this.loading_list = true;
      // this.current_deal = true;
      // this.remaining_deal = false;
      if(result['status'] == "success")
      {        
         this.getVendorDetails(this.vendor_id);
      }     
    },error=>{
      console.log(error);        
    });
  }

  update_vendor_deal_remove(pr_id){
    this.loading_list = false; 
    this.deal_pro_id = {
      product_id: pr_id,      
      vendor_id: this.vendor.id
    };
    console.log(this.deal_pro_id);
    this.db.post_rqst(this.deal_pro_id, 'vendors/vendor_deal_remove').subscribe(result => {    
      console.log(result);
      this.loading_list = true;
      if(result['status'] == "success")
      {        
        this.getVendorDetails(this.vendor_id);
      }     
    },error=>{
      console.log(error);        
    });
  }
  GetPurchaseOrder(action:any)
  {
    //console.log(action);
    
    //this.db.FetchData({'vendor_id':this.vendor.id,'action':action},'master/vendor_detail_order')
    this.db.post_rqst(  {'vendor_id':this.vendor.id,'action':action}, 'vendors/vendor_purchase_order')
      .subscribe((result)=>{
        this.vendor_purchase = result['data']['v_purchase'];
        if(action == 'Pending'){
          this.enable_all_po = false;
          this.enable_pending_po = true;
          this.enable_receive_po = false;
          this.enable_cancel_po = false;
        }
        if(action == 'All'){
          this.enable_all_po = true;
          this.enable_pending_po = false;
          this.enable_receive_po = false;
          this.enable_cancel_po = false;
        }
        if(action == 'Rejected'){
          this.enable_all_po = false;
          this.enable_pending_po = false;
          this.enable_receive_po = false;
          this.enable_cancel_po = true;
        }
        if(action == 'Received'){
          this.enable_all_po = false;
          this.enable_pending_po = false;
          this.enable_receive_po = true;
          this.enable_cancel_po = false;
        }
       
      },err => { this.dialog.retry().then((result) => { this.GetPurchaseOrder(action); }); });  

      
      
  }
  edit_cp(index:any)
  {    
    console.log(index);
    this.active[index] = Object.assign({'c_person' : "1"});
    console.log(this.active);
  }
  edit_mobile_1(index:any)
  {
    console.log(index);
    this.active[index] = Object.assign({'c_mobile1' : "1"});
    console.log(this.active);
  }
  edit_mobile_2(index:any)
  {
    console.log(index);
    this.active[index] = Object.assign({'c_mobile2' : "1"});
    console.log(this.active);
  }
  remainingdeals(){   
    this.search2.search1=''; 
    this.current_deal = false;
    this.remaining_deal = true;
    this.getVendorDetails(this.vendor_id);
    //console.log(this.current_deal);
    //console.log(this.remaining_deal);
  }
  currentdeals(){
    this.search2.search3='';
    this.current_deal = true;
    this.remaining_deal = false;
    this.getVendorDetails(this.vendor_id);
    //console.log(this.current_deal);
    //console.log(this.remaining_deal);
  }
  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(event.keyCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  active_field:any = {};
  edit_state()
  {
    this.active_field.state = true;
    console.log(this.active_field.state);
    
  }


}
