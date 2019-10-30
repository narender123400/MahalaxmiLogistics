import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';

import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-branch-stock-header-tab',
  templateUrl: './branch-stock-header-tab.component.html'
})
export class BranchStockHeaderTabComponent implements OnInit {


  id; 
  franchise_id; 
  constructor(public db : DatabaseService,private route : ActivatedRoute,private router: Router,public ses : SessionStorage,public matDialog : MatDialog , public dialog : DialogComponent) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      this.getBranch_name();
    });
  }
  
  tmp: any = {};
  pending_qty:any =0;
  b_t_b_pending_qty:any =0;

  getBranch_name() {
    this.db.get_rqst(  '','branches/getBranch_name/' + this.franchise_id )
    .subscribe(data => {
     this.tmp = data;
     this.db.franchise_name  = this.tmp.branchnam.branch_name;
     this.db.franchise_location  = this.tmp.branchnam.location_id;
     this.pending_qty = this.tmp.pending_stock ? this.tmp.pending_stock : 0;
     this.b_t_b_pending_qty = this.tmp.b_t_b_pending_stock ? this.tmp.b_t_b_pending_stock : 0;
     console.log(  this.tmp.branchnam );
     console.log(this.pending_qty);
    });
  }

}
