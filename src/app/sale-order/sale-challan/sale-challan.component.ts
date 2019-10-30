import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';


@Component({
  selector: 'app-sale-challan',
  templateUrl: './sale-challan.component.html',
})
export class SaleChallanComponent implements OnInit {

  purchase_id;
  loading_list = false;
  vendor_name;
  created_by;
  purchase_form:any = {};
  pending_items_detail: any = [];
  pendingReceiveItemValid: any= true;
  formData: any = {};
  branch_id:any = 0;
  itemdetail:any = [];

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) { }
  
  ngOnInit() {   

    console.log( this.itemdetail );
    
      this.route.params.subscribe(params => {
        console.log( params );
        
      this.purchase_id = params['id'] || 0;
      this.branch_id = params['branch_id'] || 0;
      console.log(this.purchase_id);        
    
      if( this.branch_id ){
        this.getParts();
        this.getConsigners();
      }

    if (this.purchase_id) 
      this.getPurchaseDetails(this.purchase_id); 
      
  });
  }



  getMaster(){
    this.data.type ==  this.purchase_form.type;  

    if(this.purchase_form.type == 'Part' ){

      this.getParts();
    }else{
      this.getComboList();
    }
    console.log( this.data);
    
  }


  
getComboList()
{
    this.loading_list = false;

    this.db.post_rqst(  {'consigner_id' : 0 , 'branch_id': this.branch_id } , 'sales/challan_combo')
    .subscribe( r => {
        this.loading_list = true;
        console.log(r);
        this.parts = r.data.combo;
        console.log( this.parts  );
        
    },err => {  this.loading_list = true;  this.dialog.retry().then((result) => { this.getComboList(); });   });
}



  

  parts:any = [];
getParts()
{

    this.loading_list = false;
    this.db.post_rqst(  { 'branch_id' : this.branch_id }, 'sales/getChallanBranchParts')
    .subscribe((result: any) => {
        this.loading_list = true;
        console.log(result);
        this.parts = result['parts'];
        console.log(this.parts);        
    },err => {  this.loading_list = true; this.dialog.retry().then((result) => { this.getParts(); });   });
}






consigners:any = [];
getConsigners()
{

    this.loading_list = false;
    this.db.post_rqst(  '', 'sales/consigners')
    .subscribe((result: any) => {
        this.loading_list = true;
        this.consigners = result['consigners'];
        console.log(this.consigners);        
    },err => {  this.loading_list = true; this.dialog.retry().then((result) => { this.getParts(); });   });
}






keyword = 'part_number';
// data:any = [];


selectEvent(item) {
  this.data.part_number = item.part_number;
  console.log(   this.data.part_number );
  
  if(this.data.part_number){
    this.partDetail();
  }
  
}

onChangeSearch(val: string) {
  
}

onFocused(e){
}


data:any = {};
items :any = [];
partDetail(){
  console.log(this.data.part_number );
  console.log( this.itemdetail );
  console.log( this.items );
  
  this.data = Object.assign({}, this.parts.filter(x => x.part_number === this.data.part_number )[0] ); 
console.log(  this.data );
this.data.qty = 1;
// this.data.rental_price = this.data.rental_price;
// this.data.amount = this.data.rental_price *  this.data.qty;

  
}

checkStock(){

  if( !this.data.part_number){
    this.dialog.warning('Part Number must!');
    return;
  }

  if( parseInt(   this.data.fresh_stock  ) == 0 ){
      this.dialog.warning('Stock Down!');
      return;
    }

  if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.qty ) ){
    this.dialog.warning('Transfer Qty is grater than Fresh Stock!');
    this.data.qty = 0;
    return;
  }


}



AddItem(s:any)
{
  console.log( this.itemdetail );

      if( !this.data.part_number){
        this.dialog.warning('Part Number must!');
        return;
      }

      if( parseInt(   this.data.fresh_stock  ) == 0 ){
          this.dialog.warning('Stock Down!');
          return;
        }

      if( parseInt(   this.data.fresh_stock  ) < parseInt(  this.data.qty ) ){
        this.dialog.warning('Transfer Qty is grater than Fresh Stock!');
        return;
      }


      
 

console.log( this.itemdetail );

    if(this.itemdetail.length == 0)
    {
console.log( this.itemdetail );
this.data.accept_qty = parseInt(  this.data.accept_qty );
this.data.accept_qty = parseInt(  this.data.qty );
        this.itemdetail.push(this.data);
    }
    else
    {
        for(let i=0;i<this.itemdetail.length;i++)
        {
            if(this.data.part_number == this.itemdetail[i].part_number )
            {
              this.itemdetail[i].accept_qty = parseInt(  this.itemdetail[i].accept_qty );
              this.itemdetail[i].qty = parseInt( this.itemdetail[i].qty );
                this.itemdetail[i].qty +=  parseInt(this.data.qty);
                this.itemdetail[i].accept_qty += parseInt(this.data.qty);


                
                // this.itemdetail[i].rental_price = this.data.rental_price;
                // this.itemdetail[i].amount =  this.itemdetail[i].rental_price * this.itemdetail[i].qty;

                break;
            }
            else if(i == this.itemdetail.length - 1)
            {
              this.data.accept_qty = parseInt(  this.data.accept_qty );
              this.data.accept_qty = parseInt(  this.data.qty );
              this.data.qty = parseInt( this.data.qty );
              

                this.itemdetail.push(this.data);     
                break;   
            }
        }
    }

    this.data = {};

    console.log(this.itemdetail);

    // this.calculateNetOrderTotal();

    console.log(this.itemdetail);

  // s.resetForm();

  console.log(  this.itemdetail);
  
  this.cal();

}



  orderdetail:any = {};  
  tmp:any = {};  
  getPurchaseDetails(purchase_id) {
    console.log( 'getPurchaseDetails');
    if(this.purchase_id == 0)return;
    this.loading_list = false;
    this.db.get_rqst(  '', 'sales/getSalesDeliverDetail/' + purchase_id)
    .subscribe(d => {
      this.loading_list = true;
console.log(d);

console.log( d.orderdetail );

      this.orderdetail = d.orderdetail;
      console.log(this.orderdetail);
      
      this.itemdetail = d.itemdetail; 

      this.purchase_form.p_o_n = this.orderdetail.p_o_n;
      this.purchase_form.customer_part_number = this.orderdetail.customer_part_number;


      // loop1:
      // for (let i = 0; i < this.itemdetail.length; i++) {
      //   if( this.itemdetail[i].type == 'Part' )continue loop1;
      //   loop2:
      //     for (let x = 0; x < this.itemdetail[i].combo_list.length; x++) {
      //         if( parseInt( this.itemdetail[i].combo_list[x].fresh_stock )  < parseInt( this.itemdetail[i].combo_list[x].qty )  ){
      //     // console.log( this.itemdetail );
      //     // console.log(  this.itemdetail[i].combo_list[x].fresh_stock  );
      //     // console.log(  this.itemdetail[i].combo_list[x].qty  );
          

      //           // this.itemdetail.splice( i );
      //           console.log(i);
                
      //     // console.log( this.itemdetail );

      //           break loop2;
      //         }
      //     }
          

      // }

      this.purchase_form.total_qty = 0;
      this.purchase_form.total_amount = 0;
      this.purchase_form.gst = 0;
      this.purchase_form.net_amount = 0;
      console.log( this.itemdetail );

    },error => {
      this.loading_list = true;
  
              this.dialog.retry().then((result) => {  this.getPurchaseDetails(purchase_id); }); });
  }

  add_receive_order_detail()
  {
    console.log( 'add_receive_order_detail');
    
    if( this.flag ){
      this.dialog.error('Stock Down!');
      return;
    }

    this.loading_list = false;
   this.purchase_form.invoice_date = this.purchase_form.invoice_date ? this.db.pickerFormat(this.purchase_form.invoice_date) : '';
   this.purchase_form.date_created = this.purchase_form.date_created ? this.db.pickerFormat(this.purchase_form.date_created) : '';


   this.formData = this.purchase_form;
   this.formData.orderdetail = this.orderdetail;
   this.formData.items = this.itemdetail;

   this.formData.created_by = this.db.datauser.id;
   this.formData.purchase_id = this.purchase_id;
   this.formData.branch_id = this.branch_id;
   
   this.db.insert_rqst( {'challan' : this.formData },'sales/sale_challan')
    .subscribe( r => {

      this.loading_list = true;
      if(  this.branch_id ){
      this.router.navigate(['/sale-challan-list/']);
    }else{

      this.router.navigate(['/sale-order-detail/'+this.purchase_id]); 
    }
    this.dialog.success('Challan has created successfully!');
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
    this.purchase_form.net_amount  = 0;

    for (let i = 0; i < this.itemdetail.length; i++) {

      this.itemdetail[i].accept_qty   = parseFloat(  this.itemdetail[i].accept_qty   );
      this.itemdetail[i].qty  =  parseFloat(  this.itemdetail[i].qty  );
      this.purchase_form.total_qty +=  parseFloat(  this.itemdetail[i].qty  );


      this.itemdetail[i].accept_qty = this.itemdetail[i].accept_qty ? this.itemdetail[i].accept_qty : 0;
      this.itemdetail[i].gst  = 18;

      this.itemdetail[i].deliver_rantal = this.itemdetail[i].accept_qty * this.itemdetail[i].rental_price;

      this.purchase_form.total_qty += this.itemdetail[i].accept_qty;
      this.purchase_form.total_amount += parseFloat(  this.itemdetail[i].deliver_rantal );

      this.itemdetail[i].gst_amount  = parseFloat(  this.itemdetail[i].deliver_rantal ) * ( parseFloat( this.itemdetail[i].gst ) / 100);
      this.purchase_form.gst  += parseFloat(    this.itemdetail[i].gst_amount );


      this.purchase_form.net_amount +=  parseInt( this.itemdetail[i].gst_amount )  +  parseFloat( this.itemdetail[i].deliver_rantal );


      
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
