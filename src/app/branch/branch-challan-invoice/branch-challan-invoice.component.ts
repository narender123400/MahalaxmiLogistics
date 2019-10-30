import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';


@Component({
  selector: 'app-branch-challan-invoice',
  templateUrl: './branch-challan-invoice.component.html'
})
export class BranchChallanInvoiceComponent implements OnInit {


  purchase_id;
  loading_list = false;
  vendor_name;
  created_by;
  purchase_form:any = {};
  pending_items_detail: any = [];
  pendingReceiveItemValid: any= true;
  formData: any = {};

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) { }
  
  ngOnInit() {   

    this.purchase_form.vehicals_info = '<b>Vehicle Type&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;</b><div><b>vehicle No.&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:&nbsp; &nbsp;<br></b></div><div><b>vehicle Freight&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;<br></b></div><div><b>Driver Name&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :&nbsp; &nbsp;</b></div><div><b>Driver Mobile No.&nbsp; &nbsp; &nbsp;:&nbsp; &nbsp;</b></div><div><b>Name Of Transport&nbsp; :&nbsp; &nbsp;</b></div>';
    this.purchase_form.gst_per = 18; 
    this.purchase_form.shipping_charge = 0; 
    this.purchase_form.sac_desc = 'LEASING OR RENTAL SERVICES CONCERNING OTHER GOODS';
    this.purchase_form.sac = '997329';


      this.route.params.subscribe(params => {

      console.log( this.db.challans);
      
    if ( this.db.challans.length > 0 ) {

      this.purchase_form.challans =  Object.assign({}, this.db.challans );
      this.db.challans = [];

      this.getPurchaseDetails(); 
    }else{
      this.dialog.warning('At least 1 Challan!');
      this.db.goBack();
      return;
    }
  });
  }
  itemdetail:any = [];
  orderdetail:any = {};  
  tmp:any = {};  
  sales_order_consignee :any = [];
  getPurchaseDetails( ) {
    this.loading_list = false;
    this.db.post_rqst(  {'challans' :  this.purchase_form.challans }, 'sales/getChallans')
    .subscribe(r => {
      this.loading_list = true;
console.log(r);

// console.log( d.orderdetail );

      // this.orderdetail = d.orderdetail;
      // this.sales_order_consignee = d.sales_order_consignee;
      
      this.itemdetail = r.challans;      


      this.purchase_form.p_o_n = r.agreement.p_o_n;
      this.purchase_form.customer_part_number = r.agreement.customer_part_number;


      this.purchase_form.total_qty = 0;
      this.purchase_form.total_amount = 0;
      this.purchase_form.gst = 0;
      this.purchase_form.net_amount = 0;

      this.cal();
    },error => {
      this.loading_list = true;
  
              this.dialog.retry().then((result) => {  this.getPurchaseDetails(); }); });
  }

  add_receive_order_detail()
  {
    this.loading_list = false;
   this.purchase_form.invoice_date = this.purchase_form.invoice_date ? this.db.pickerFormat(this.purchase_form.invoice_date) : '';
   this.purchase_form.customer_part_number =    this.purchase_form.customer_part_number ?    this.purchase_form.customer_part_number : '';
   this.purchase_form.p_o_n =    this.purchase_form.p_o_n ?    this.purchase_form.p_o_n : '';
   this.formData = this.purchase_form;
   this.formData.orderdetail = this.orderdetail;
   this.formData.items = this.itemdetail;
   this.formData.sales_order_id = 0;
   
   if( this.itemdetail.length  > 0){
       this.formData.sales_order_id = this.itemdetail[0].sales_order_id; 
   }

   this.formData.created_by = this.db.datauser.id;

   this.db.insert_rqst( {'invoice':this.formData} ,'sales/challanInvoice')
    .subscribe((result:any) => {
      console.log(result); 

      this.db.goBack();


      this.loading_list = true;

    },err=>{ this.loading_list = true; this.dialog.retry().then((result) => {  }); });
    
  }
  
   fildata = new FormData();

  fileChange(event) {
    this.fildata.append( 'doc', event.target.files[0]);
    console.log(this.fildata);
console.log( event.target.files[0]);

    this.db.fileData(this.formData,'purchase/fil')
    .subscribe((r) => {
      console.log(r);
      
     

    },err=>{ this.loading_list = true; this.dialog.retry().then((result) => {  }); });
      

  }


  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(event.keyCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  

  reject_qty;
  accept_qty;
  pending;
  val_accept(i:any)
  {

    // if( this.itemdetail[i].pending_qty >= this.itemdetail[i].accept_qty){
    //   this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty;
    // }else{      
    //   this.itemdetail[i].accept_qty = this.itemdetail[i].pending_qty;
    //   this.dialog.warning('Greater Qty!');

    // }
    this.fresh_stock(i);
  }


  
  
  fresh_stock(i:any)
  {
    this.itemdetail[i].gst = 18;

      if( this.itemdetail[i].fresh_stock <= 0 || ( this.itemdetail[i].fresh_stock < this.itemdetail[i].accept_qty) ) {
        this.itemdetail[i].accept_qty = 0;
        this.dialog.error('Stock Down!');
          
      }

    
      // console.log(  this.purchase_form);
      this.cal();

  }

  // cal(){

  //   this.purchase_form.total_qty  = 0;
  //   this.purchase_form.total_amount  = 0;
  //   this.purchase_form.gst  = 0;
  //   this.purchase_form.net_amount  = 0;

  //   for (let i = 0; i < this.itemdetail.length; i++) {

  //     this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty ? this.itemdetail[i].accept_qty : 0;
  //     this.itemdetail[i].gst  = 18;

  //     this.itemdetail[i].deliver_rantal = this.itemdetail[i].accept_qty * this.itemdetail[i].rental_price;

  //     this.purchase_form.total_qty += this.itemdetail[i].accept_qty;
  //     this.purchase_form.total_amount += parseInt(  this.itemdetail[i].deliver_rantal );

  //     this.itemdetail[i].gst_amount  = parseInt(  this.itemdetail[i].deliver_rantal ) * ( parseInt( this.itemdetail[i].gst ) / 100);
  //     this.purchase_form.gst  += parseInt(    this.itemdetail[i].gst_amount );


  //     this.purchase_form.net_amount +=  parseInt( this.itemdetail[i].gst_amount )  +  parseInt( this.itemdetail[i].deliver_rantal );


      
  //   }

  //     console.log(  this.purchase_form);

  // }

  cal(){
        
    this.purchase_form.total_qty  = 0;
    this.purchase_form.total_amount  = 0;
    this.purchase_form.gst  = 0;
    this.purchase_form.gst_per  = this.purchase_form.gst_per ? this.purchase_form.gst_per : 0;
    this.purchase_form.shipping_charge  = this.purchase_form.shipping_charge ? this.purchase_form.shipping_charge : 0;
    this.purchase_form.net_amount  = 0;
this.purchase_form.actual_amount  = 0;

    this.purchase_form.cgst_amount = 0;
    this.purchase_form.sgst_amount= 0;
    this.purchase_form.igst_amount= 0;
    
    for (let i = 0; i < this.itemdetail.length; i++) {
      
      
      this.itemdetail[i].cgst_amount  = 0;
      this.itemdetail[i].sgst_amount  = 0;
      this.itemdetail[i].igst_amount  = 0;
      this.itemdetail[i].gst_amount  = 0;
      
      this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty ? this.itemdetail[i].accept_qty : 0;
      
      // this.itemdetail[i].gst  = 18;
      
      this.itemdetail[i].deliver_rantal = this.itemdetail[i].accept_qty * this.itemdetail[i].rental_price;
      this.itemdetail[i].accept_qty = parseInt( this.itemdetail[i].accept_qty );
      this.purchase_form.total_qty += this.itemdetail[i].accept_qty;
      this.purchase_form.total_amount += parseFloat(  this.itemdetail[i].deliver_rantal );
      
      console.log(this.orderdetail.branch_state);
      console.log(this.orderdetail.consinger_state);

      if( this.orderdetail.branch_state ==  this.orderdetail.consinger_state   ){
        
        this.itemdetail[i].cgst_amount  = parseFloat(  this.itemdetail[i].deliver_rantal ) * ( ( parseFloat(  this.purchase_form.gst_per ) / 2 ) / 100);
        this.itemdetail[i].sgst_amount  = parseFloat(  this.itemdetail[i].deliver_rantal ) * ( ( parseFloat(  this.purchase_form.gst_per ) / 2 ) / 100);
        
      }else{
        
        this.itemdetail[i].igst_amount  = parseInt(  this.itemdetail[i].deliver_rantal ) * ( parseFloat(  this.purchase_form.gst_per ) / 100);
        
      }
      
      this.itemdetail[i].gst_amount  += parseFloat( this.itemdetail[i].cgst_amount )  + parseFloat( this.itemdetail[i].sgst_amount ) + parseFloat( this.itemdetail[i].igst_amount );
      
      console.log(this.purchase_form.cgst_amount);
      console.log(this.purchase_form.sgst_amount);
      console.log(this.purchase_form.igst_amount);
      
      this.purchase_form.cgst_amount  += Math.round( parseFloat(    this.itemdetail[i].cgst_amount ) );
      this.purchase_form.sgst_amount  += Math.round( parseFloat(    this.itemdetail[i].sgst_amount ) );
      this.purchase_form.igst_amount  += Math.round( parseFloat(    this.itemdetail[i].igst_amount ) );
      
      this.purchase_form.gst  += parseFloat( this.purchase_form.cgst_amount )  + parseFloat( this.purchase_form.sgst_amount ) + parseFloat( this.purchase_form.igst_amount );
      
      this.purchase_form.gst = Math.round( this.purchase_form.gst );
      
      this.purchase_form.net_amount +=  parseFloat( this.itemdetail[i].gst_amount )  +  parseFloat( this.itemdetail[i].deliver_rantal );
      
      this.purchase_form.actual_amount = parseFloat( this.purchase_form.net_amount) + parseFloat( this.purchase_form.shipping_charge)
      
      this.purchase_form.actual_amount =  Math.round( this.purchase_form.actual_amount );
    }
    
    console.log(  this.purchase_form);
    
  }




  val_reject(i:any)
  {

    if( this.itemdetail[i].reject_qty >= (this.itemdetail[i].pending_qty-this.itemdetail[i].accept_qty)){
      this.itemdetail[i].reject_qty = (this.itemdetail[i].pending_qty-this.itemdetail[i].accept_qty);
    }else{      
      this.itemdetail[i].reject_qty = this.itemdetail[i].reject_qty;
    }
    //this.pending_items_detail[i].accept_qty = parseInt(this.pending_items_detail[i].pending_qty) - parseInt(reject_qty);
    this.val_accept(i);
  }

}
