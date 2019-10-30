import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-consignee-detail',
  templateUrl: './consignee-detail.component.html',
})
export class ConsigneeDetailComponent implements OnInit {

  franchise_id;
  id;
  loading_list = false;

  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) {}

  mode:any = '2';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];

    if (this.franchise_id) {
       this.getConsigneeDetails();
    }
  });
  }

  getData:any = {};
  consigners:any = [];
  vendor_deal: any = [];
  vendor_redeal: any = [];
  
  getConsigneeDetails() {
    console.log(this.db.datauser);
    
    this.loading_list = true;
    this.db.get_rqst(  '', 'consignee/detail/' + this.franchise_id)
    .subscribe(d => {

      console.log(d);
      this.getData = d.getData;

      this.consigners = d.consigners;

      this.vendor_deal = d.c_cdeal;
      this.vendor_redeal = d.c_rdeal;  

      console.log(this.getData);
  
      this.loading_list = false;
    },err => {  this.dialog.retry().then((result) => {this.getConsigneeDetails();  console.log(err); }); });
  }

  edit(){
    this.router.navigate(['consignee-add/' +this.franchise_id]);
  }


  // remainingdeals(){    
  //   this.current_deal = false;
  //   this.remaining_deal = true;
  //   //console.log(this.current_deal);
  //   //console.log(this.remaining_deal);
  // }
  // currentdeals(){
  //   this.current_deal = true;
  //   this.remaining_deal = false;
  //   //console.log(this.current_deal);
  //   //console.log(this.remaining_deal);
  // }



  // current_deal : any = true ;
  // remaining_deal : any =  false;
  
  // deal_pro_id:any = {};
  // update_vendor_deal_add(pr_id,pr_nm){
  //   this.loading_list = false; 
  //     this.deal_pro_id = {
  //       id: pr_id,
  //       part_number: pr_nm,
  //       consignee_id: this.franchise_id
  //     };
  //     console.log(this.deal_pro_id);
  //     this.db.post_rqst(this.deal_pro_id, 'consignee/consignee_deal_add').subscribe(result => {    
  //     console.log(result);
  //     this.loading_list = true;
  //     this.current_deal = true;
  //     this.remaining_deal = false;
  //     this.getConsigneeDetails();

  //       },error=>{
  //     console.log(error);        
  //   });
  // }

  // update_vendor_deal_remove(pr_id){
  //   this.loading_list = false; 
  //   this.deal_pro_id = {
  //     part_id: pr_id,      
  //     consignee_id: this.franchise_id
  //   };
  //   console.log(this.deal_pro_id);
  //   this.db.post_rqst(this.deal_pro_id, 'consignee/consignee_deal_remove').subscribe(result => {    
  //     console.log(result);
  //     this.loading_list = true;
        
  //       this.getConsigneeDetails();

  //     },error=>{
  //     console.log(error);        
  //   });
  // }

  print(): void {
  console.log(this.getData.plan_id);


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
    .print-section table tr table.table1 tr td:nth-child(1){width: 324px;}
    .print-section table tr table.table1 tr td:nth-child(2){width: 700px;}
    </style>
    </head>
    <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }
}
