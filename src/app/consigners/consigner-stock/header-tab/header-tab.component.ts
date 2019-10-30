import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';

import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-header-tab',
  templateUrl: './header-tab.component.html',
})
export class HeaderTabComponent implements OnInit {


  id; 
  franchise_id; 
  tmp;
  constructor(public db : DatabaseService,private route : ActivatedRoute,private router: Router,public ses : SessionStorage,public matDialog : MatDialog , public dialog : DialogComponent) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      this.getConsigner_name();
    });
  }
  
  aggre_name:any = '';
  saleChallan_name:any ='' ;
  intransit_name:any ='' ;
  invoice_name:any = '';
  SaleOrderConsignee:any = '';
  
  getConsigner_name() {
    this.db.get_rqst(  '','consigners/getConsigner_name/' + this.franchise_id )
    .subscribe(data => {
      console.log(data);
     this.tmp = data;

     this.db.franchise_name  = this.tmp.consignernam.name;
     this.aggre_name  = this.tmp.aggrementnam;
     this.saleChallan_name  = this.tmp.SaleChallan;
     this.intransit_name  = this.tmp.ConsignerIntransit;
     this.invoice_name  = this.tmp.SaleOrderDeliver;
     this.SaleOrderConsignee  = this.tmp.ce;
    });
  }

}
