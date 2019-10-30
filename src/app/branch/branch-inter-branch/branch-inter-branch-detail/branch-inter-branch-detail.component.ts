import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../_services/DatabaseService';
import {DialogComponent} from '../../../dialog/dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-branch-inter-branch-detail',
  templateUrl: './branch-inter-branch-detail.component.html',
  
})
export class BranchInterBranchDetailComponent implements OnInit {


  loading: any;
  invoiceDetail: any = [];
  itemdetail: any = [];
  invoicePaymentList: any = [];
  data: any;
  invoice_id;
  loading_list = false;
  current_page = 1;
  last_page: number ;
  
  constructor(public db: DatabaseService,
              private route: ActivatedRoute, 
              private router: Router, public dialog: DialogComponent,
              public matDialog: MatDialog 
              ) { }
     
    ngOnInit() {
        this.route.params.subscribe(params => {
          this.invoice_id = params['id'];
        if (this.invoice_id)
         { this.salesInvoiceDetail(this.invoice_id); }
      });
    }

    salesInvoiceDetail(invoice_id) {
      this.loading_list = false;
      this.db.post_rqst(  {'id':this.invoice_id}, 'branches/branch_inter_detail')
      .subscribe(data => {
        this.invoiceDetail = data['data']['invoicedetail'];
        this.itemdetail = data['data']['itemdetail'];
        this.loading_list = true;
        console.log(data);
        console.log(this.invoiceDetail);
        console.log(this.itemdetail);
      },err => {  this.dialog.retry().then((result) => { this.salesInvoiceDetail(invoice_id); });   });
    }

save = 0;
add(x){
  if(x){
    this.save++;
  }else{
    this.save--;
  }
}
    flag :any = 0;
    fresh_stock(i:any)
    {
    this.flag = 0;
    this.itemdetail[i].receive_qty = this.itemdetail[i].receive_qty ? this.itemdetail[i].receive_qty : 0;
    this.itemdetail[i].maintenance_qty = this.itemdetail[i].maintenance_qty ? this.itemdetail[i].maintenance_qty : 0;
    // for (let i = 0; i < this.itemdetail.length; i++) {
    //         this.itemdetail[i].greater = '';
    //         if( parseInt(this.itemdetail[i].pending_qty ) < ( parseInt(this.itemdetail[i].accept_qty ) ) )
    //         {
    //           this.itemdetail[i].greater = '1';
    //           this.flag++;
    //           this.dialog.warning('Stock is grater');
    //         }
    //       }
    }
submit_sales_invoice()
{
  if( this.flag ){
    this.dialog.warning('Stock is grater');
    return;
  }
this.loading_list = false;
    this.db.insert_rqst( {'stock':this.itemdetail, 'remark' : this.invoiceDetail.remark ,'id' : this.invoice_id} , 'branches/branch_inter_receive_stock')
    .subscribe((result: any) => {
        this.loading_list = true;
        this.dialog.success( 'Stock Updated');
        for (let j = 0; j < this.itemdetail.length; j++) {
          this.itemdetail[j].updated_at = '1';
          this.save = 0;
       }
       this.salesInvoiceDetail(this.invoice_id);
      },err => { this.loading_list = true; this.dialog.retry().then((result) => {});
    });
  }




  bill:any = {};

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
  