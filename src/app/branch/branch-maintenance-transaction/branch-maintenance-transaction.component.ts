import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-branch-maintenance-transaction',
  templateUrl: './branch-maintenance-transaction.component.html',
})
export class BranchMaintenanceTransactionComponent implements OnInit {
  
  prod_id:any = '';
  
  loading: any;
  products: any = [];
  unit_prices: any = [];
  attr_types: any = [];
  
  stock_total: any = [];
  stock_qty: any = [];
  
  attr_options: any = [];
  data: any;
  
  loading_list: any = false;
  unit_id: any = '';
  mode :any = '';
  franchise_id :any = '';
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {
    }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.prod_id = params['id'];
        this.franchise_id = params['franchise_id'];
        
        
        if (this.prod_id) {
          this.getCompany();
          this.mode = '1'; 
        }
      });
    }
     
    
    
    product:any = {};
    porducFinishGood:any = [];
    unit:any = {};
    branchs:any = [];
    
    item_detail :any = {};
    incoiming_stock :any = [];
    
    getCompany() {
      
      
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/getCompanyMaintenance')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.item_detail = d.item_detail;
        this.incoiming_stock = d.incoiming_stock;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getCompany();
        });
      });
    }
    
    manage :any = [];
    
    getManage() {
      
      
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/getBranchMange')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.manage = d;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getManage();
        });
      });
    }
    
    branch_inter_incoiming_stock :any = [];
    filter :any = {};
    pickup:any = [];

    getConsignee() {
      
      this.filter.branch_id = this.franchise_id;
      this.loading_list = true;
      this.db.post_rqst( { 'id':this.prod_id, 'branch_id' : this.franchise_id  }, 'branches/getpickUpMaintenance')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.pickup = d;
        
      },err => {
        this.loading_list = false;
        this.dialog.retry().then((result) => {
          this.getConsignee();
        });
      });
    }
    
    branch :any = [];
    
    getbranch() {
      
      
      this.loading_list = true;
      this.filter.branch_id = this.franchise_id;
      this.db.post_rqst( { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/getBranchInterMaintanence')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        this.branch = d;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranch();
        });
      });
    }
    
    
    
    
    
   
    
    
  }