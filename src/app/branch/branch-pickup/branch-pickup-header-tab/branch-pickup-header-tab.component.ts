import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { ActivatedRoute,Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { SessionStorage } from 'src/app/_services/SessionService';

@Component({
  selector: 'app-branch-pickup-header-tab',
  templateUrl: './branch-pickup-header-tab.component.html',
})
export class BranchPickupHeaderTabComponent implements OnInit {

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
  getBranch_name() {
    this.db.get_rqst(  '','branches/getBranch_name/' + this.franchise_id )
    .subscribe(data => {
     this.tmp = data;
     this.db.franchise_name  = this.tmp.branchnam.branch_name;
    });
  }

}
