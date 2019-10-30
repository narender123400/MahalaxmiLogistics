import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-branch-left-tab',
  templateUrl: './branch-left-tab.component.html',
})
export class BranchLeftTabComponent implements OnInit {

  franchise_id;
  tmp;
  frchise; 
  constructor(public db : DatabaseService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      if(this.franchise_id) this.getBranch_name();
    });
  }
  pending_qty:any =0;

  getBranch_name() {
    this.db.get_rqst(  '','branches/getBranch_name/' + this.franchise_id )
    .subscribe(data => {

     this.tmp = data;
     this.db.franchise_name  = this.tmp.branchnam.branch_name;
     this.pending_qty = this.tmp.pending_stock ? this.tmp.pending_stock : 0;

     console.log(this.pending_qty);
    });
  }

}