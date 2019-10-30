import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';
// import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-branch-transaction',
  templateUrl: './branch-transaction.component.html'
})
export class BranchTransactionComponent implements OnInit {
  
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
          this.getProductDetail();
          this.mode = '1'; 
        }
        
        if (this.franchise_id) {
          this.filter.stock_type = 'outgoing';
          this.filter.status = '';
          this.getInterbranchtobranchincoming();
          this.getInterbranchtobranchOutgoing();
          
        }
      });
    }
    
    
    // openDialog(): void {
    //   const dialogRef = this.dialogs.open(InvoiceModalComponent, {
    //     width: '768px',
    //     data: {}
    //   });
    
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //   });
    // }
    
    
    product:any = {};
    porducFinishGood:any = [];
    unit:any = {};
    branchs:any = [];
    
    item_detail :any = {};
    incoiming_stock :any = [];
    
    getProductDetail() {
      
      
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branchStockIncoming')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.item_detail = d.item_detail;
        this.incoiming_stock = d.incoiming_stock;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getProductDetail();
        });
      });
    }
    
    branch_incoiming_stock :any = [];
    
    getbranchtobranchincoming() {
      
      
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branchInterStockIncoming')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.item_detail = d.item_detail;
        this.branch_incoiming_stock = d.incoiming_stock;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchtobranchincoming();
        });
      });
    }
    
    branch_inter_incoiming_stock :any = [];
    filter :any = {};
    
    getInterbranchtobranchincoming() {
      
      this.filter.branch_id = this.franchise_id;
      this.loading_list = true;
      this.db.post_rqst( { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branchInterStockIncoming')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        this.item_detail = d.item_detail;
        this.branch_incoiming_stock = d.incoiming_stock;
        
      },err => {
        this.loading_list = false;
        this.dialog.retry().then((result) => {
          this.getbranchtobranchincoming();
        });
      });
    }
    
    branch_inter_outgoing_stock :any = [];
    
    getInterbranchtobranchOutgoing() {
      
      
      this.loading_list = true;
      this.filter.branch_id = this.franchise_id;
      this.db.post_rqst( { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branchInterStockIncoming')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        this.item_detail = d.item_detail;
        this.branch_incoiming_stock = d.incoiming_stock;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchtobranchincoming();
        });
      });
    }
    
    
    
    
    
    getbranchsDetail() {
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/consnrStock')
      .subscribe(d => {
        this.loading_list = false;
        
        this.item_detail = d.item_detail;
        this.incoiming_stock = d.consigner;
        
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchsDetail();
        });
      });
    }
    
    
    
    
    
    
    
    outgoing_stock :any = [];
    getbranch_outgoing() {
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branch_outgoing')
      .subscribe(d => {
        this.loading_list = false;
        
        // this.item_detail = d.item_detail;
        this.outgoing_stock = d;
        
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchsDetail();
        });
      });
    }
    
    outgoing_challan:any = [];
    getChallan_Outgoing() {
      this.loading_list = true;
      this.db.post_rqst(  { 'id':this.prod_id , 'branch_id' : this.franchise_id  }, 'branches/branch_challan_outgoing')
      .subscribe(d => {
        this.loading_list = false;
        
        // this.item_detail = d.item_detail;
        this.outgoing_challan = d;
        
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchsDetail();
        });
      });
    }
    
    
    
    
    
    
    getbranchsConsDetail() {
      
      this.loading_list = true;
      
      this.db.post_rqst(  { 'branch_id' : this.franchise_id , 'id': this.prod_id }, 'branches/consneeStockIncoming')
      .subscribe(d => {
        this.loading_list = false;
        
        this.incoiming_stock = d;
        
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.getbranchsConsDetail();
        });
      });
    }
    
    
    
    
    Manually_incoming :any = [];
    
    manuallyIncoming() {
      
      this.loading_list = true;
      this.db.post_rqst( { 'id':this.prod_id ,'branch_id':this.franchise_id }, 'branches/branchManullayIncomingStock')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );
        
        // this.item_detail = d.item_detail;
        this.Manually_incoming = d.manuallyIncoming;
        
      },err => {
        this.loading_list = false;
        
        this.dialog.retry().then((result) => {
          this.manuallyIncoming();
        });
      });
    }
    
    
    
  }