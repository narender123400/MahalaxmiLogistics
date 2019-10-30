import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';


@Component({
  selector: 'app-sale-order-detail',
  templateUrl: './sale-order-detail.component.html'
})
export class SaleOrderDetailComponent implements OnInit {
  
  loading: any;
  orderDetail: any = [];
  orderItemDetail: any = [];
  orderInvoiceList: any = [];
  consignee: any = [];
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
          this.sales_challan();
          this.challan_list();
        }
        
      });
    }
    
    
    
    
    
    combo_item_list:any = [];
    salesOrderDetail() {
      console.log(this.order_id);
      this.loading_list = false;
      
      this.db.get_rqst(  '', 'sales/getSalesOrder/' + this.order_id)
      .subscribe( d  => {
        console.log( d );
        
        this.loading_list = true;
        
        if( d.status == 'NOT FOUND' ){ 
          this.dialog.warning('This Order has been Deleted!'); 
          this.router.navigate(['/sale-order-list']);
          return;
        }
        
        this.orderDetail = d.orderdetail; 
        this.orderItemDetail = d.item_list;
        // this.orderInvoiceList = d.orderInvoiceList;
        this.consignee = d.consignee;
        this.combo_item_list = d.combo_item_list;
        console.log(this.consignee);
        
        
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
    
    redirect_previous() {
      this.current_page--;
      this.sales_challan();
    }
    redirect_next() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.sales_challan();
    }
    
    salesOrderList:any = [];
    sales_challan()
    {
      this.loading_list = false;
      this.filter.id = this.order_id;
      this.db.post_rqst(  { 'filter' : this.filter}, 'sales/sales_challan_list?page=' + this.current_page)
      .subscribe( d  => {
        console.log( d );
        
        this.loading_list = true;

        this.current_page = d.salesOrderList.current_page;
        this.last_page = d.salesOrderList.last_page;
        this.salesOrderList = d.salesOrderList.data; 
        
        
      },err => { this.dialog.retry().then((result) => { this.sales_challan();  this.salesOrderDetail();  });   });
    }
    
    redirect_previous1() {
      this.current_page--;
      this.challan_list();
    }
    redirect_next1() {
      if (this.current_page < this.last_page) { this.current_page++; }
      else { this.current_page = 1; }
      this.challan_list();
    }
    
    salesChallanList:any = [];
    filter:any = {};
    challan_list()
    {
      this.loading_list = false;
      this.filter.id = this.order_id;
      this.db.post_rqst(  { 'filter' : this.filter}, 'sales/challan_list?page=' + this.current_page)
      .subscribe( d  => {
        console.log( d );
        
        this.loading_list = true;
        
        this.current_page = d.salesChallanList.current_page;
        this.last_page = d.salesChallanList.last_page;
        this.salesChallanList = d.salesChallanList.data; 
        
        console.log(  this.salesChallanList );
        
      },err => { this.dialog.retry().then((result) => { this.challan_list();  this.sales_challan();  });   });
    }
    
    
    
    
    challans : any = [];
    addChallans(event,id){
      console.log(event);
      
      console.log(id);
      
      console.log( this.challans.indexOf( id) );
      
      if(event.checked)
      this.challans.push(id);
      else
      this.challans.splice( this.challans.indexOf( id), 1 );
      console.log(this.challans);
      
      this.db.challans = this.challans; 
      
    }
    
    print1() {
      
      
      setTimeout(function(){ 
        
        let printContents, popupWin;
        printContents = document.getElementById('print-section1').innerHTML;
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
    
    
    bill:any ={};
    
    
    print2(r:any) {
      console.log( this.salesOrderList[r]);
      console.log( r );
      
      
      this.bill =  this.salesOrderList[r];
      console.log( this.bill );
      
      setTimeout(function(){ 
        
        let printContents, popupWin;
        printContents = document.getElementById('print-section2').innerHTML;
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
    
    bill2:any ={};
    
    
    print3(r:any) {
      console.log( this.salesChallanList[r]);
      console.log( r );
      
      
      this.bill2 =  this.salesChallanList[r];
      console.log( this.bill2 );
      
      setTimeout(function(){ 
        
        let printContents, popupWin;
        printContents = document.getElementById('print-section3').innerHTML;
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
  