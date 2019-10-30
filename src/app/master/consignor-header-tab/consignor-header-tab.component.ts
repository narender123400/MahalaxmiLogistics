import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';

import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-consignor-header-tab',
  templateUrl: './consignor-header-tab.component.html'
})
export class ConsignorHeaderTabComponent implements OnInit {
  
  franchise_id;
  tmp;
  frchise; 
  constructor(public db : DatabaseService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = this. db.datauser.consignor_id;
      console.log( this.franchise_id);
      
      this.getConsigner_name();
    });
  }


  getConsigner_name() {
    this.db.get_rqst(  '','consigners/getConsigner_name/' + this.franchise_id )
    .subscribe(data => {
     this.tmp = data;
     this.db.franchise_name  = this.tmp.consignernam.name;
    });
  }


}
