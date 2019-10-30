import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../_services/DatabaseService';
import {DialogComponent} from '../../../dialog/dialog.component';



@Component({
  selector: 'app-in-transit-detail',
  templateUrl: './in-transit-detail.component.html'
})
export class InTransitDetailComponent implements OnInit {

  loading: any;
  orderDetail: any = {};
  orderItemDetail: any = []
  orderInvoiceList: any = {};
  data: any;

  order_id;
  loading_list = true;

  current_page = 1;
  last_page: number ;

  constructor(public db: DatabaseService,
              private route: ActivatedRoute, 
              public dialog: DialogComponent,
              private router: Router) {   
              }

  ngOnInit() {

      this.route.params.subscribe(params => {
        this.order_id = params['id'] || '';
        if( this.order_id ) {
          this.salesOrderDetail(); 
          // this.sales_challan();
        }

      });
  }




  

  salesOrderDetail() {
console.log(this.order_id);
    this.loading_list = false;

    this.db.post_rqst(  {'id' :this.order_id }, 'sales/getinTransitDetail')
      .subscribe( d  => {
        console.log( d );
        this.loading_list = true;
        
        if( !d.orderdetail ){ 
          this.dialog.warning('This Order has been Deleted!'); 
          this.router.navigate(['/sale-order-list']);
          return;
        }


        this.orderDetail = d.orderdetail; 

     
        this.orderItemDetail = d.item_list;
        // this.orderInvoiceList = d.orderInvoiceList;

        for (let i = 0; i < this.orderItemDetail.length; i++) {
          this.orderItemDetail[i].transfer_qty = 0;
          
        }


      },err => {  this.dialog.retry().then((result) => { this.salesOrderDetail(); });   });
}


  reject_order() {
    this.dialog.delete('Reject Order !','Confirm', 'Cancel','').then((result) => {
      console.log(result);
      if(result){
      this.loading_list = false;
      this.db.post_rqst(  { 'login':this.db.datauser , 'id' : this.order_id} , 'sales/reject_order')
      .subscribe(data => {
      this.loading_list = true;
      this.salesOrderDetail();
      this.dialog.error('Order Rejected Successfully');
  });
      }
});
}


checkFrshStock(){

  if( parseInt(   this.data.intransit_qty  ) == 0 ){
    this.dialog.warning('Not Exist Intransit Qty!');

  }

  if( parseInt(   this.data.intransit_qty  ) < parseInt(  this.data.transfer_qty ) ){
    this.dialog.warning('Transfer Qty is grater than Qntransit Qty!');

  }
}





required_qty:any = '';
grater_stock:any = '';

    update_qty(){
      this.grater_stock = 0;
      for (let j = 0; j < this.orderItemDetail.length; j++)
      {

        

        if(this.orderItemDetail[j].intransit_qty < this.orderItemDetail[j].transfer_qty){
          this.grater_stock++;
        }




      }



      if(this.grater_stock){
        this.dialog.warning('Transfer Qty grater than required qty!');
      }

      
    }




    
  reject_qty;
  accept_qty;
  stock_down;
  pending;
  // val_accept(i:any)
  // {

  //   if( this.orderItemDetail[i].intransit_qty >= this.orderItemDetail[i].transfer_qty){
  //     this.orderItemDetail[i].transfer_qty = this.orderItemDetail[i].transfer_qty;
  //   }else{      
  //     this.orderItemDetail[i].transfer_qty = this.orderItemDetail[i].intransit_qty;
  //     this.dialog.warning('Greater Qty!');

  //   }
  //   this.fresh_stock(i);
  // }


  
  
  fresh_stock(i:any)
  {

     
  // for (let i = 0; i < this.orderItemDetail.length; i++) {



  if(  this.orderItemDetail[i].intransit_qty < this.orderItemDetail[i].transfer_qty) {

    // this.orderItemDetail[i].transfer_qty = 0;
    
    this.dialog.error('Grater Qty!');
    return;
      
  }

  if(  this.orderItemDetail[i].intransit_qty >= this.orderItemDetail[i].transfer_qty) {


    if(  this.orderItemDetail[i].fresh_stock < this.orderItemDetail[i].transfer_qty) {

          // this.orderItemDetail[i].transfer_qty = 0;
        
          this.dialog.error('Stock Down!');
          return;
    }
   
      
  }


  

  
// }

  }




savingData :any = false;

graterqty: any = 0;
lowstockqty: any = 0;
submit_sales_invoice()
{

for (let i = 0; i < this.orderItemDetail.length; i++) {



  if(  this.orderItemDetail[i].intransit_qty < this.orderItemDetail[i].transfer_qty) {

    this.orderItemDetail[i].transfer_qty = 0;
    
    this.dialog.error('Grater Qty!');
    return;
      
  }

  if(  this.orderItemDetail[i].intransit_qty >= this.orderItemDetail[i].transfer_qty) {


    if(  this.orderItemDetail[i].fresh_stock < this.orderItemDetail[i].transfer_qty) {

          this.orderItemDetail[i].transfer_qty = 0;
        
          this.dialog.error('Stock Down!');
          return;
    }
   
      
  }


  

  
}


// console.log('out');

    this.orderDetail.login_id= this.db.datauser.id;
    this.loading_list = false;
  
    this.orderDetail.itemList = this.orderItemDetail;

    this.db.insert_rqst( {'stock':this.orderDetail} , 'sales/deliveredIntransit')
    .subscribe((result: any) => {
        this.savingData = false;
        this.loading_list = true;
      this.salesOrderDetail();
        console.log(result);
        this.dialog.success('Intransit Stock Delivered!');


    },err => {console.log(err);  this.savingData = false; this.loading_list = true; this.dialog.retry().then((result) => { }); });



}


print_pending() {
        
  setTimeout(function(){ 
    
    let printContents, popupWin;
    printContents = document.getElementById('print-section-pending').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
  <head>
  <title>Print tab</title>
  
  <style>

  body
  {
    font-family: 'arial';
  }
  .print-section
  {
    width: 1024px;
    background: #fff;
    padding: 15px;
    margin: 0 auto
  }
  
  
  .print-section table
  {
    width: 1024px;
    box-sizing: border-box;
    table-layout: fixed;
  }
  
  
  .print-section table tr table.table1 tr td h2
  {
      font-size: 4px;
      line-height: 10px;
  }
  
  .print-section table tr table.table1 tr td p
  {
      font-size: 1px;
      line-height: 10px;
  }

  table .table3 tr td
  {
    background: #ccc;
  }
  
  .print-section table tr table.table1 tr td:nth-child(1){width: 324px;}
  .print-section table tr table.table1 tr td:nth-child(2){width: 700px;}


  </style>
  
  </head>
  
  <body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );
    popupWin.document.close();
    
  }, 300);
  
  
  
}


print_delivered() {
    
  setTimeout(function(){ 
    
    let printContents, popupWin;
    printContents = document.getElementById('print-section-delivered').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
  <head>
  <title>Print tab</title>
  
  <style>

  body
  {
    font-family: 'arial';
  }
  .print-section
  {
    width: 1024px;
    background: #fff;
    padding: 15px;
    margin: 0 auto
  }
  
  
  .print-section table
  {
    width: 1024px;
    box-sizing: border-box;
    table-layout: fixed;
  }
  
  
  .print-section table tr table.table1 tr td h2
  {
      font-size: 4px;
      line-height: 10px;
  }
  
  .print-section table tr table.table1 tr td p
  {
      font-size: 1px;
      line-height: 10px;
  }

  table .table3 tr td
  {
    background: #ccc;
  }
  
  .print-section table tr table.table1 tr td:nth-child(1){width: 324px;}
  .print-section table tr table.table1 tr td:nth-child(2){width: 700px;}


  </style>
  
  </head>
  
  <body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );
    popupWin.document.close();
    
  }, 300);
  
  
  
}





}
