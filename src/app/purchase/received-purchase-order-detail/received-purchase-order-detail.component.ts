import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';



@Component({
  selector: 'app-received-purchase-order-detail',
  templateUrl: './received-purchase-order-detail.component.html',
})
export class ReceivedPurchaseOrderDetailComponent implements OnInit {
  purchase_id;
  loading_list = false;
  loading_data = true;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) {}
    
ngOnInit() {      
      this.route.params.subscribe(params => {
        this.purchase_id = params['id'];
        console.log(this.purchase_id);        
     
      if (this.purchase_id) {
        this.getPurchaseDetails(); 
      }
    });
    }
    parent:any = {};
    child:any = {};
    sub_child:any = [];

    getPurchaseDetails() {
      this.loading_list = false;
      this.db.post_rqst(  {'id':this.purchase_id}, 'purchase/purchase_order_reveived_detail')
      .subscribe(d => {
        console.log(d);

        this.parent = d.data.parent;
        this.child = d.data.child;
        this.sub_child = d.data.sub_child;

        console.log(this.parent);
        this.loading_list = true;
      },error => {
  
        this.dialog.retry().then((result) => {  this.getPurchaseDetails(); }); });
    }






    print() {
    
      
        setTimeout(function(){ 
        
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
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
  