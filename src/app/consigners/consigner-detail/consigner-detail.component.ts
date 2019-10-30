import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-consigner-detail',
  templateUrl: './consigner-detail.component.html',
})
export class ConsignerDetailComponent implements OnInit {
  
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
       this.getConsignerDetails();
    }
  });
  }

  getData:any = {};
  vendor_deal: any = [];
  vendor_redeal: any = [];
  tmp_vendor_redeal: any = [];
  tmp_vendor_deal: any = [];
  
  getConsignerDetails() {
    console.log(this.db.datauser);
    
    this.loading_list = true;
    this.db.get_rqst(  '', 'consigners/detail/' + this.franchise_id)
    .subscribe(d => {
      this.getData = d.getData;

      this.vendor_deal = d.c_cdeal;
      this.vendor_redeal = d.c_rdeal;  

      this.tmp_vendor_redeal = d.c_rdeal;  
      this.tmp_vendor_deal = d.c_cdeal;  

      console.log(this.getData);
  
      this.loading_list = false;
    },err => {  this.dialog.retry().then((result) => {this.getConsignerDetails();  console.log(err); }); });
  }

  search2:any={};
  tmp_search3:any={};
  getPartCheckin(mode,search){

    if(mode == 'mode2')
    { 
      this.vendor_redeal= [];

      for(var i=0;i<this.tmp_vendor_redeal.length; i++)
      {
        search=search.toLowerCase();
        this.tmp_search3 =  this.tmp_vendor_redeal[i]['part_number'].toLowerCase();
        if(this.tmp_search3.includes(search))
        {
          this.vendor_redeal.push(this.tmp_vendor_redeal[i]);
        }
      }
    }

    if(mode == 'mode1')
    { 
      this.vendor_deal= [];

      for(var i=0;i<this.tmp_vendor_deal.length; i++)
      {
        search=search.toLowerCase();
        this.tmp_search3 =  this.tmp_vendor_deal[i]['part_number'].toLowerCase();
        if(this.tmp_search3.includes(search))
        {
          this.vendor_deal.push(this.tmp_vendor_deal[i]);
        }
      }
    }
   


    
  }

  active:any={};

toggleterritory(key,action)
{
  console.log(action);
  console.log(key);
  
  if(action == 'open')
  { this.active.user = true; }
  if(action == 'close')
  { this.active.user = false;}

  console.log(this.active);


}




clear()
{
  this.search2.search3='';

  this.test = '0';

  this.current_deal = true;
  this.remaining_deal = false;
  this.getConsignerDetails();
}

test:any = '0';

  remainingdeals(){    
    this.search2.search1='';
    this.current_deal = false;
    this.remaining_deal = true;
    this.test = '1';
    this.getConsignerDetails();
    //console.log(this.current_deal);
    //console.log(this.remaining_deal);
  }
  currentdeals(){
    this.search2.search3='';
    this.test = '0';

    this.current_deal = true;
    this.remaining_deal = false;
    this.getConsignerDetails();
    //console.log(this.current_deal);
    //console.log(this.remaining_deal);
  }



  current_deal : any = true;
  remaining_deal : any =  false;
  
  deal_pro_id:any = {};
  update_vendor_deal_add(pr_id,pr_nm){
    this.loading_list = false; 
      this.deal_pro_id = {
        id: pr_id,
        part_number: pr_nm,
        consigner_id: this.franchise_id
      };
      console.log(this.deal_pro_id);
      this.db.post_rqst(this.deal_pro_id, 'consigners/consigner_deal_add').subscribe(result => {    
      console.log(result);
      this.loading_list = true;
      // this.current_deal = true;
      // this.remaining_deal = false;
      this.getConsignerDetails();

        },error=>{
      console.log(error);        
    });
  }

  update_vendor_deal_remove(pr_id){
    this.loading_list = false; 
    this.deal_pro_id = {
      part_id: pr_id,      
      consigner_id: this.franchise_id
    };
    console.log(this.deal_pro_id);
    this.db.post_rqst(this.deal_pro_id, 'consigners/consigner_deal_remove').subscribe(result => {    
      console.log(result);
      this.loading_list = true;
        
        this.getConsignerDetails();

      },error=>{
      console.log(error);        
    });
  }


  


edit(){
    this.router.navigate(['consigner-add/' + this.franchise_id]);
  }


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