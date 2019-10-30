import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-consigner-left-tab',
  templateUrl: './consigner-left-tab.component.html',
})
export class ConsignerLeftTabComponent implements OnInit {

  franchise_id;
  tmp;
  frchise; 
  constructor(public db : DatabaseService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      if(this.franchise_id) this.getConsigner_name();
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