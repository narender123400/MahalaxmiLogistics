import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';


@Component({
  selector: 'app-sale-order-deliver',
  templateUrl: './sale-order-deliver.component.html'
})
export class SaleOrderDeliverComponent implements OnInit {
  
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
      
    this.purchase_form.gst_per = 18; 


      this.route.params.subscribe(params => {
        this.purchase_id = params['id'];
        console.log(this.purchase_id);        
        
        if (this.purchase_id) {
          this.getPurchaseDetails(this.purchase_id); 
        }
      });
      this.purchase_form.gst_per = 18; 
    }
    itemdetail:any = [];
    orderdetail:any = {};  
    tmp:any = {};  
    sales_order_consignee :any = [];
    getPurchaseDetails(purchase_id) {
      this.loading_list = false;
      this.db.get_rqst(  '', 'sales/getSalesDeliverDetail/' + purchase_id)
      .subscribe(d => {
        this.loading_list = true;
        console.log(d);
        
        console.log( d.orderdetail );
        
        this.orderdetail = d.orderdetail;
        // this.sales_order_consignee = d.sales_order_consignee;
        console.log(this.orderdetail);
        
        this.itemdetail = d.itemdetail;      
        
        
        this.purchase_form.total_qty = 0;
        this.purchase_form.total_amount = 0;
        this.purchase_form.gst = 0;
        this.purchase_form.net_amount = 0;

        this.purchase_form.p_o_n = this.orderdetail.p_o_n;
        this.purchase_form.customer_part_number = this.orderdetail.customer_part_number;
        this.purchase_form.sac = '997329';
        this.purchase_form.sac_desc = 'LEASING OR RENTAL SERVICES CONCERNING OTHER GOODS';
        
      },error => {
        this.loading_list = true;
        
        this.dialog.retry().then((result) => {  this.getPurchaseDetails(purchase_id); }); });
      }
      
      add_receive_order_detail()
      {
        this.loading_list = false;
        this.purchase_form.invoice_date = this.purchase_form.invoice_date ? this.db.pickerFormat(this.purchase_form.invoice_date) : '';
        this.purchase_form.date_created = this.purchase_form.date_created ? this.db.pickerFormat(this.purchase_form.date_created) : '';
        this.purchase_form.sac = this.purchase_form.sac ? this.purchase_form.sac : '';
        this.purchase_form.sac_desc = this.purchase_form.sac_desc ? this.purchase_form.sac_desc : '';
        this.formData = this.purchase_form;
        this.formData.orderdetail = this.orderdetail;
        this.formData.items = this.itemdetail;
        
        this.formData.created_by = this.db.datauser.id;
        this.formData.purchase_id = this.purchase_id;
        
        this.db.insert_rqst({'invoice': this.formData },'sales/save_po_receive')
        .subscribe((result:any) => {
          console.log(result); 
          
          this.router.navigate(['/sale-order-detail/'+this.purchase_id]); 
          
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
      
      
      
 

      val_accept(i:any)
      {
    
        if( this.itemdetail[i].type == 'Part' ){
          this.fresh_stock(i);
          this.cal();
        }else if( this.itemdetail[i].type == 'Combo' ){
          this.comboStockk(i);
        }
    
        // if( this.itemdetail[i].pending_qty >= this.itemdetail[i].accept_qty){
        //   this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty;
        // }else{      
        //   this.itemdetail[i].accept_qty = this.itemdetail[i].pending_qty;
        //   this.dialog.warning('Greater Qty!');
    
        // }
        // this.fresh_stock(i);
      }
    
      partStockManager(qty , part ){
        for (let x = 0; x < this.itemdetail.length; x++) {
          if(this.itemdetail[x].type == 'Part'   ){
            // && x != x1  
                  if( part == this.itemdetail[x].part_number ){
                        this.itemdetail[x].fresh_stock =  qty;
                  }
          }else if(this.itemdetail[x].type == 'Combo'   ){
                  for (let a = 0; a < this.itemdetail[x].combo_list.length; a++) {
                    // && x != x1  
                        if( part == this.itemdetail[x].combo_list[a].part_number){
                            // this.itemdetail[x].combo_list[a].free_stock =  qty;
                            this.itemdetail[x].combo_list[a].fresh_stock =   qty;
                        }
                  }
              }
        }
      }
    
      flag:any = 0;
      comboStockk(i:any)
      {
        var available = true;
        this.flag = 0;
    
          console.log(i);
          
          for (let x = 0; x < this.itemdetail[i].combo_list.length; x++) {
    
            this.itemdetail[i].combo_list[x].fresh_stock = parseInt( this.itemdetail[i].combo_list[x].fresh_stock );
    
            this.itemdetail[i].combo_list[x].combo_qty = this.itemdetail[i].combo_list[x].combo_qty  || 0; 
            this.itemdetail[i].combo_list[x].last_combo_qty = this.itemdetail[i].combo_list[x].last_combo_qty || 0;
            this.itemdetail[i].combo_list[x].fresh_stock = this.itemdetail[i].combo_list[x].fresh_stock || 0;
    
            
            this.itemdetail[i].combo_list[x].combo_qty = this.itemdetail[i].combo_list[x].qty * this.itemdetail[i].accept_qty ;
            this.itemdetail[i].combo_list[x].fresh_stock += parseInt(  this.itemdetail[i].combo_list[x].last_combo_qty ) ;
            this.itemdetail[i].combo_list[x].fresh_stock -=  parseInt(  this.itemdetail[i].combo_list[x].combo_qty ) ;
            
            this.itemdetail[i].combo_list[x].last_combo_qty = this.itemdetail[i].combo_list[x].combo_qty;
              
            
            if( this.itemdetail[i].combo_list[x].fresh_stock <= 0 ){
              available = false;
            }
    
           
              this.partStockManager( this.itemdetail[i].combo_list[x].fresh_stock , this.itemdetail[i].combo_list[x].part_number  );
    
    
              console.log( this.itemdetail[i].combo_list[x] );
              
          }
    
    
            if( !available){
              for (let x = 0; x < this.itemdetail[i].combo_list.length; x++) {
                
                this.itemdetail[i].combo_list[x].fresh_stock += parseInt(  this.itemdetail[i].combo_list[x].last_combo_qty ) ;
    
                this.partStockManager( this.itemdetail[i].combo_list[x].fresh_stock , this.itemdetail[i].combo_list[x].part_number  );
                this.itemdetail[i].combo_list[x].last_combo_qty = 0;
                this.itemdetail[i].combo_list[x].combo_qty = 0;
                this.itemdetail[i].accept_qty = 0;
    
              }
              
              this.dialog.error('Stock Down!');
              available = true;
          }
    
          this.cal();
      }
      
      
      fresh_stock(i:any)
      {
    
        var available = true;
          // if( this.itemdetail[i].fresh_stock <= 0 || ( this.itemdetail[i].fresh_stock < this.itemdetail[i].accept_qty) ) {
    
    
            this.itemdetail[i].fresh_stock = this.itemdetail[i].fresh_stock  || 0; 
            this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty  || 0; 
            this.itemdetail[i].last_accept_qty = this.itemdetail[i].last_accept_qty || 0;
            this.itemdetail[i].accept_qty =  parseInt(  this.itemdetail[i].accept_qty );
            this.itemdetail[i].last_accept_qty =  parseInt(  this.itemdetail[i].last_accept_qty );
            this.itemdetail[i].fresh_stock =  parseInt(  this.itemdetail[i].fresh_stock );
    
    
    
            this.itemdetail[i].fresh_stock  +=    parseInt( this.itemdetail[i].last_accept_qty );
            this.itemdetail[i].fresh_stock  -=     parseInt(  this.itemdetail[i].accept_qty );
    
    
            if( this.itemdetail[i].fresh_stock <= 0 ){
              available = false;
            }
    
            if( available ){
    
              this.partStockManager( this.itemdetail[i].fresh_stock , this.itemdetail[i].part_number  );
            }
            this.itemdetail[i].last_accept_qty = this.itemdetail[i].accept_qty;
    
            if( !available){
                
                this.itemdetail[i].fresh_stock += parseInt(  this.itemdetail[i].last_accept_qty ) ;
    
                this.partStockManager( this.itemdetail[i].fresh_stock , this.itemdetail[i].part_number  );
                this.itemdetail[i].last_accept_qty = 0;
                this.itemdetail[i].accept_qty = 0;
                this.dialog.error('Stock Down!');
    
              }
              
    
          
    
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
          
          this.itemdetail[i].deliver_rantal = this.itemdetail[i].accept_qty * this.itemdetail[i].rental_price;
          
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
    