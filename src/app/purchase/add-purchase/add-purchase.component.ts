import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {SessionStorage} from '../../_services/SessionService';
import {DialogComponent} from '../../dialog/dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html'
})
export class AddPurchaseComponent implements OnInit {  
  options = {};
  vendor: any = [];
  loader: any = '';
  current_page = 1;
  search: any = '';
  loading_list = false;  
  purchase_form:any = {};
  item_form:any = {};
  
  constructor(public db: DatabaseService, public dialog: DialogComponent, public router: Router,public ses: SessionStorage) {
  }
  
  ngOnInit() {
    const elems = document.querySelectorAll('select');
    this.GetVendorList();
    this.purchase_form.gst_per = 0; 
    this.purchase_form.shipping_charge = 0; 
    this.purchase_form.hsn_code = 0; 
  }
  
  temp_cons:any = [];
  GetVendorList() {  
    this.loading_list = true;  
    this.db.get_rqst('' , 'purchase/getVendor')
    .subscribe((d: any) => {
    this.loading_list = false;  

      this.vendor = d;
      console.log(this.vendor);        
      console.log(this.vendor.state);        
      console.log(this.vendor.users_state);    
      
      this.temp_cons = d;
      
    },error => {this.loading_list = false;  this.dialog.retry().then((result) => {  this.GetVendorList(); }); });
        
    //console.log(this.ses.users.username);   
  }
  
  selected_vendor: any = {};
  clear(){
    this.getCaegoryList();
    this.data = {};
    this.purchase_list = [];
 console.log( this.purchase_list);

 this.selected_vendor = Object.assign({}, this.vendor.filter(x => x.id === this.purchase_form.vendor_id )[0] ); 
 this.purchase_form.gst_per =  this.selected_vendor.gst_percentage;
 this.purchase_form.material_type =  this.selected_vendor.meterial_type;
    
}
  
  categoryList:any = [];
  getCaegoryList()
  {

    this.brand = [];
    this.product = [];

    // this.purchase_form.vendor_id = vendor_id;
      this.loading_list = true;
 

      // this.loading_list = false;
      this.db.get_rqst(  '', 'purchase/getVendorCategory/'+this.purchase_form.vendor_id)
      .subscribe((result: any) => {
          this.loading_list = false;
          // this.loading_list = true;
          console.log(result);
          this.categoryList = result['data']['vendors_category'];
          console.log(this.categoryList);        
      },err => {  this.loading_list = false;  this.dialog.retry().then((result) => { this.getCaegoryList(); });   });
  }

  update_qty(index,qty,price){
      
      
    // this.purchase_list[index].amount = qty*price;
    // console.log(this.purchase_list[index].amount);
this.cal();
  }
  
  brand:any = [];
  
  GetVendorBrand()
  {
    this.product = [];
    this.loading_list = true;
    this.db.post_rqst(  {'item': this.data } , 'purchase/getVendorBrand/'+this.purchase_form.vendor_id)
    .subscribe((result: any) => {
    this.loading_list = false;

      console.log(result);
      this.brand = result['data']['vendors_brand'];
      console.log(this.brand);        
    },error => {this.loading_list = false;  this.dialog.retry().then((result) => {  this.GetVendorBrand(); }); });
  }
  
  
  
  
  product:any = [];
  data : any = {};
  getDetails()
  {
    this.loading_list = true;
    console.log(this.item_form);
    this.db.post_rqst( {'id': this.item_form.part_id  } , 'purchase/getDetails')
    .subscribe( r => {
      this.loading_list = false;

      console.log(r.detail);
      // r.data;
      this.data = r.detail;
      this.data.qty = 1;

    this.data.amount = this.data.qty * this.data.purchase_price;


      // this.GetAmount(1,  r.detail.sale_price);

    },error => {this.loading_list = false;  this.dialog.retry().then((result) => {  this.getDetails(); }); });
  }
  
  



  keyword = 'part_number';
  // data:any = [];
 
 
  selectEvent(item) {
    this.item_form.part_id = item.id;
    console.log(   this.item_form.part_id );
    
    if(this.item_form.part_id){
      this.getDetails();
    }
    
  }
 
  onChangeSearch(val: string) {
    
  }
  
  onFocused(e){
  }






  
  GetAmount(qty,purchase_price)
  {
    // qty = qty ? qty : 1;   
    // this.data.amount = qty * purchase_price;
    // console.log(this.data);    
  }  
  
  purchase_list:any = [];
    AddItem(f:any = '')
  {
    // this.purchase_list.push(this.data);
    console.log(this.purchase_list);   
    this.purchase_form.item_total_temp = 0; 
    


    if(this.purchase_list.length == 0)
    {
        this.purchase_list.push(this.data);
        console.log(this.data);
        
    }
    else
    {
        for(let i=0;i<this.purchase_list.length;i++)
        {
            if(this.data.part_number == this.purchase_list[i].part_number )
            {
             
              this.purchase_list[i].qty = parseInt( this.purchase_list[i].qty );
              this.purchase_list[i].purchase_price += parseInt(this.data.purchase_price );
              this.purchase_list[i].qty += parseInt(this.data.qty);
              this.purchase_list[i].amount += this.data.amount;
      
              break;    

            }
            else if(i == this.purchase_list.length - 1)
            {
                this.purchase_list.push(this.data);    
                break;    
            }
        }
    }

    for(var j=0; j<this.purchase_list.length; j++)
    {
      this.purchase_form.item_total_temp  = parseFloat(this.purchase_list[j].amount) + parseInt(this.purchase_form.item_total_temp);      
    } 



    this.purchase_form.item_total = parseFloat(this.purchase_form.item_total_temp).toFixed(2);    
    
  console.log(this.purchase_list);    
  this.data = {};
  if(f)
  f.resetForm();
  this.cal();

  }
  
  RemoveItem(index,amount)
  {
    this.purchase_form.item_total = parseFloat(this.purchase_form.item_total) - amount;  
    console.log(index);
    this.dialog.delete('Item Data !').then((result) => {
      console.log(result);
      if(result){
        this.purchase_list.splice(index,1);
        this.dialog.success('Item has been deleted.');
        this.cal();
      }
    },error => { this.dialog.retry().then((result) => {  this.RemoveItem(index,amount); }); });   
  }
  sendingData:any;
  submit_po()
  {
    this.loading_list = true;
    this.sendingData = true;
    // this.purchase_form.item_data = this.purchase_list;
    console.log(this.purchase_form);
    console.log(this.purchase_list);  
    
    this.db.insert_rqst( {'data':this.purchase_form,'item':this.purchase_list,'created_by': this.ses.users.id,'created_by_type': this.ses.users.username} , 'purchase/addOrder')
    .subscribe((result: any) => {
      this.sendingData = false;
      this.loading_list = false;
      console.log(result);
        if(result)
        {
          this.router.navigate(['/purchases']);
        }
      },error => {    this.sendingData = false; this.loading_list = false;this.dialog.retry().then((result) => {   }); });
  } 


  cal(){

    this.purchase_form.total_qty  = 0;
    this.purchase_form.total_amount  = 0;
    this.purchase_form.gst  = 0;
    this.purchase_form.gst_per  = this.purchase_form.gst_per ? this.purchase_form.gst_per : 0;
    this.purchase_form.net_amount  = 0;
    this.purchase_form.actual_amount  = 0;
    this.purchase_form.cgst_amount = 0;
    this.purchase_form.sgst_amount= 0;
    this.purchase_form.igst_amount= 0;

    for (let i = 0; i < this.purchase_list.length; i++) {

      this.purchase_list[i].cgst_amount  = 0;
      this.purchase_list[i].sgst_amount  = 0;
      this.purchase_list[i].igst_amount  = 0;
      this.purchase_list[i].gst_amount  = 0;

      this.purchase_list[i].qty = this.purchase_list[i].qty ? this.purchase_list[i].qty : 0;

      // this.purchase_list[i].gst  = 18;

      this.purchase_list[i].amount = this.purchase_list[i].qty * this.purchase_list[i].purchase_price;

      this.purchase_form.total_qty += parseInt( this.purchase_list[i].qty );
      this.purchase_form.total_amount += parseInt(  this.purchase_list[i].amount );
      // this.purchase_form.tot_pur_amount += parseInt(  this.purchase_list[i].amount );

      // this.itemdetail[i].gst_amount  = parseInt(  this.itemdetail[i].deliver_rantal ) * ( parseInt( this.itemdetail[i].gst ) / 100);
      // this.purchase_form.gst  += parseInt(    this.itemdetail[i].gst_amount );

      console.log(this.selected_vendor.state );
      console.log(this.db.datauser.state );
console.log( this.purchase_form.gst_per );

      if( this.selected_vendor.state ==  this.db.datauser.state   ){
        

        this.purchase_list[i].cgst_amount  = parseInt(  this.purchase_list[i].amount ) * ( ( parseInt( this.purchase_form.gst_per ) / 2 ) / 100);
        this.purchase_list[i].sgst_amount  = parseInt(  this.purchase_list[i].amount ) * ( ( parseInt( this.purchase_form.gst_per ) / 2 ) / 100);
        
      }else{
        
        this.purchase_list[i].igst_amount  = parseInt(  this.purchase_list[i].amount ) * ( parseInt( this.purchase_form.gst_per ) / 100);
        
      }
      
      this.purchase_list[i].gst_amount  += parseInt( this.purchase_list[i].cgst_amount )  + parseInt( this.purchase_list[i].sgst_amount ) + parseInt( this.purchase_list[i].igst_amount );
      
      console.log(this.purchase_form.cgst_amount);
      console.log(this.purchase_form.sgst_amount);
      console.log(this.purchase_form.igst_amount);
      
      this.purchase_form.cgst_amount  += parseInt(    this.purchase_list[i].cgst_amount );
      this.purchase_form.sgst_amount  += parseInt(    this.purchase_list[i].sgst_amount );
      this.purchase_form.igst_amount  += parseInt(    this.purchase_list[i].igst_amount );

      this.purchase_form.gst  += parseInt( this.purchase_form.cgst_amount )  + parseInt( this.purchase_form.sgst_amount ) + parseInt( this.purchase_form.igst_amount );
          
          
      this.purchase_form.net_amount +=  parseInt( this.purchase_list[i].gst_amount )  +  parseInt( this.purchase_list[i].amount );

      // this.purchase_form.actual_amount  = parseInt(this.purchase_form.net_amount) + parseInt(this.purchase_form.shipping_charge) ;

      // this.purchase_form.net_amount =  parseInt( this.purchase_form.gst )  +  parseInt( this.purchase_form.total_amount );


      
    }

      console.log(  this.purchase_form);

  }

  active:any={};

toggleterritory1(key,action)
{
  console.log(action);
  console.log(key);
  
  if(action == 'open')
  { this.active.user1 = true; }
  if(action == 'close')
  { this.active.user1 = false;}

  console.log(this.active);


}

search2:any={};
tmpsearch3:any={};
getItemscheckin(con,search)
{
  console.log(search);
  if(con=='con2'){
    this.vendor=[];
    for(var i=0;i<this.temp_cons.length; i++)
    {
      search=search.toLowerCase();
      this.tmpsearch3=this.temp_cons[i]['name'].toLowerCase();
      if(this.tmpsearch3.includes(search))
      {
        this.vendor.push(this.temp_cons[i]);
      }     
    }    
    console.log(this.vendor);
  }
}
  
}
