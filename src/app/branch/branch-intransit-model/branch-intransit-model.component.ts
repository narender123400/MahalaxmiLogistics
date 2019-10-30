import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog} from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';
// import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-branch-intransit-model',
  templateUrl: './branch-intransit-model.component.html',
})
export class BranchIntransitModelComponent implements OnInit {
  
  
  loading: any;
  loading_list: any = false;
  mode :any = '';
  franchise_id :any = '';
  
  branch:any = [];
  item_detail :any = {};
  incoiming_stock :any = [];
  filter:any = {};
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: DialogComponent, public dialogs: MatDialog) {

      this.mode = '1'; 

      this.filter.part_id = data.id; 
      this.filter.branch_id = data.branch_id; 
      this.filter.mode = data.mode; 

    }



    ngOnInit() {
      this.route.params.subscribe(params => {
        this.franchise_id = params['franchise_id'];
        this.mode = '1'; 
        this.branchDetail();
      
      });
    }
    
    branchDetail() {
      this.loading_list = true;
      this.db.post_rqst(  {'branch_id' : this.filter.branch_id , 'id' : this.filter.part_id  }, 'branches/branchIntransitList')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.branch = d;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.branchDetail();
        });
      });
    }
    
    consignor :any = [];
    
    intransitConsigner() {
      this.loading_list = true;
      this.db.post_rqst(  { 'branch_id' : this.filter.branch_id, 'id' : this.filter.part_id , 'mode' : this.filter.mode  }, 'branches/intransit_consigner')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.consignor = d;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.intransitConsigner();
        });
      });
    }
    
 
    
    
  }