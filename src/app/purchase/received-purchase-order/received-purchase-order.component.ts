import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-received-purchase-order',
  templateUrl: './received-purchase-order.component.html'
})
export class ReceivedPurchaseOrderComponent implements OnInit {
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
      this.purchase_form.shipping_charge = 0; 
      this.purchase_form.gst_per = 0; 
      
      
      this.route.params.subscribe(params => {
        this.purchase_id = params['id'];
        console.log(this.purchase_id);        
        
        if (this.purchase_id) {
          this.getPurchaseDetails(this.purchase_id); 
        }
      });
      this.itemdetail.gst_per = 0; 
      
    }
    itemdetail:any = [];
    orderdetail:any = [];  
    tmp:any = {}; 
    user:any = {}; 
    getPurchaseDetails(purchase_id) {
      this.loading_list = false;
      this.db.get_rqst(  '', 'purchase/details/' + purchase_id)
      .subscribe(data => {
        //console.log(data);
        this.tmp = data;
        this.orderdetail = this.tmp.data.orderdetail;
        this.itemdetail = this.tmp.data.itemdetail;      
        this.created_by = this.tmp.data.usernam;
        this.user = this.tmp.data.usernam;
        // console.log('*****DATA*****');    
        // console.log('****item detail****');
        // console.log(this.itemdetail);
        this.loading_list = true;
        console.log( this.user.state);
        
      },error => {
        
        this.dialog.retry().then((result) => {  this.getPurchaseDetails(purchase_id); }); });
      }
      
      add_receive_order_detail()
      {
        this.loading_list = false;
        
        console.log(this.purchase_form);
        console.log(this.itemdetail);
        this.purchase_form.invoice_date = this.db.pickerFormat(this.purchase_form.invoice_date);
        
        this.formData = this.purchase_form;
        console.log(this.formData);
        this.formData['invoice_date']=this.formData['invoice_date'] || '';
        this.formData['invoice_amt']=this.formData['invoice_amt'] || '';
        this.formData['receive_note']=this.formData['receive_note'] || '';
        this.formData['purchase_order_id']=this.orderdetail.id;
        this.formData['vendor_id']=this.orderdetail.vendor_id;
        this.formData['created_by']=this.orderdetail.created_by;
        this.formData['created_by_type']=this.orderdetail.created_by_type;
        
        
        
        this.formData.items = this.itemdetail;
        this.db.insert_rqst(this.formData,'purchase/save_po_receive')
        .subscribe( r => {
          this.loading_list = true;
          if( !this.fileSelected ){
            this.router.navigate(['/purchases/'+this.purchase_id+'/details/']); 
            this.dialog.success('Success!');
            return;
          }else{
            this.upload_attachment( r['data']['id'] );
          }
            
          
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
        
        if( this.itemdetail[i].pending_qty >= this.itemdetail[i].accept_qty){
          this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty;
        }else{      
          this.dialog.warning('Accept Qty is grater than total qty!');
          this.itemdetail[i].accept_qty = 0;
        }
        //this.pending_items_detail[i].accept_qty = parseInt(this.pending_items_detail[i].pending_qty) - parseInt(reject_qty);
        this.val_reject(i);
      }
      
      val_reject(i:any)
      {
        
        if( this.itemdetail[i].reject_qty > (this.itemdetail[i].pending_qty-this.itemdetail[i].accept_qty)){
          // this.itemdetail[i].reject_qty = (this.itemdetail[i].pending_qty-this.itemdetail[i].accept_qty);
          this.itemdetail[i].reject_qty = 0;
          this.dialog.warning('Reject Qty is grater than total qty!');
        }else{      
          this.itemdetail[i].reject_qty = this.itemdetail[i].reject_qty;
        }
        //this.pending_items_detail[i].accept_qty = parseInt(this.pending_items_detail[i].pending_qty) - parseInt(reject_qty);
        // this.val_accept(i);
        
        this.cal();
        
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
        
        for (let i = 0; i < this.itemdetail.length; i++) {
          
          this.itemdetail[i].cgst_amount  = 0;
          this.itemdetail[i].sgst_amount  = 0;
          this.itemdetail[i].igst_amount  = 0;
          this.itemdetail[i].gst_amount  = 0;
          
          this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty ? this.itemdetail[i].accept_qty : 0;
          
          // this.itemdetail[i].gst  = 18;
          
          this.itemdetail[i].amount = this.itemdetail[i].accept_qty * this.itemdetail[i].rate;
          
          this.purchase_form.total_qty += this.itemdetail[i].accept_qty;
          this.purchase_form.total_amount += parseInt(  this.itemdetail[i].amount );
          
          // this.itemdetail[i].gst_amount  = parseInt(  this.itemdetail[i].deliver_rantal ) * ( parseInt( this.itemdetail[i].gst ) / 100);
          // this.purchase_form.gst  += parseInt(    this.itemdetail[i].gst_amount );
          
          console.log(this.orderdetail.state);
          console.log(this.user.state);
          console.log( this.itemdetail.gst_per );
          
          
          if( this.orderdetail.state ==  this.db.datauser.state   ){
            
            this.itemdetail[i].cgst_amount  = parseInt(  this.itemdetail[i].amount ) * ( ( parseInt( this.purchase_form.gst_per ) / 2 ) / 100);
            this.itemdetail[i].sgst_amount  = parseInt(  this.itemdetail[i].amount ) * ( ( parseInt( this.purchase_form.gst_per ) / 2 ) / 100);
            
          }else{
            
            this.itemdetail[i].igst_amount  = parseInt(  this.itemdetail[i].amount ) * ( parseInt( this.purchase_form.gst_per ) / 100);
            
          }
          
          this.itemdetail[i].gst_amount  += parseInt( this.itemdetail[i].cgst_amount )  + parseInt( this.itemdetail[i].sgst_amount ) + parseInt( this.itemdetail[i].igst_amount );
          
          console.log(this.purchase_form.cgst_amount);
          console.log(this.purchase_form.sgst_amount);
          console.log(this.purchase_form.igst_amount);
          
          this.purchase_form.cgst_amount  += parseInt(    this.itemdetail[i].cgst_amount );
          this.purchase_form.sgst_amount  += parseInt(    this.itemdetail[i].sgst_amount );
          this.purchase_form.igst_amount  += parseInt(    this.itemdetail[i].igst_amount );
          
          this.purchase_form.gst  += parseInt( this.purchase_form.cgst_amount )  + parseInt( this.purchase_form.sgst_amount ) + parseInt( this.purchase_form.igst_amount );
          
          
          this.purchase_form.net_amount +=  parseInt( this.itemdetail[i].gst_amount )  +  parseInt( this.itemdetail[i].amount );
          
          
          // this.purchase_form.net_amount =  parseInt( this.purchase_form.gst )  +  parseInt( this.purchase_form.total_amount );
          this.purchase_form.actual_amount = parseInt( this.purchase_form.net_amount) + parseInt( this.purchase_form.shipping_charge)
          
          
        }
        
        console.log(  this.purchase_form);
        
      }
      
      
      
      
      attachment:any = '';
      file:any = {};
      fileSelected : any = 0;
      onUploadChange1(evt: any,f) {
        console.log(f);
        this.fileSelected = 0;
        
        this.file = evt.target.files[0];
        if(this.file){
          this.fileSelected++;
        console.log(this.fileSelected );

        }
      }
      
      
      Form = new FormData();
      // exist_coupon:any=[];
      upload_attachment(id){
        this.loading_list = true; 
        this.Form.append('attachment', this.file, this.file.name);
        this.Form.append('id', id);

        this.db.fileData( this.Form, 'invoice_attachment')
        .subscribe(d => {  
          this.loading_list = false;

        console.log(d);


          this.Form = new FormData();

        console.log(this.Form );

          
          if(d['status'] == 'SUCCESS' ){
            this.router.navigate(['/purchases/'+this.purchase_id+'/details/']); 
            this.dialog.success( 'Invoice Uploade Successfully');
          }

          
        },err => {console.log(err);  this.Form = new FormData(); this.loading_list = false; });
        
        
      }
      
      
      
      
    }
    