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
  selector: 'app-consignee-transaction',
  templateUrl: './consignee-transaction.component.html'
})
export class ConsigneeTransactionComponent implements OnInit {

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
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent, public dialogs: MatDialog) {
}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.prod_id = params['id'];
      this.cons_id = params['franchise_id'];

    
    if (this.prod_id && this.cons_id) {
       this.getProductDetail();
       this.mode = '1'; 
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
  incoming:any = [];
  cons_id : any = '';

  getProductDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'cons_id':this.cons_id }, 'consignee/intrnsit_incoming')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.product = this.data.prod;
        // this.porducFinishGood = this.data.data.finish_good;
        this.incoming = this.data.incoming;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getProductDetail();
            });
      });
  }



  getOutgoingDetail() {
    // this.loading_list = true;
    // this.db.post_rqst(  { 'id':this.prod_id  }, 'stock/getOutgoingDetail')
    //   .subscribe(data => {
    //     this.loading_list = false;
    //     this.data = data;
    //     this.branchs = this.data.data.branch;
    //     console.log(this.data);
        

    //   },err => {
    //     this.loading_list = false;

    //         this.dialog.retry().then((result) => {
    //             this.getbranchsDetail();
    //         });
    //   });
  }






  getbranchsDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'mode' : '1' }, 'stock/getFinishGoodDetail')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.incoming = this.data.data.branch;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsDetail();
            });
      });
  }




  stock :any = '';
  getbranchsConsDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'consignor_id':this.cons_id }, 'branches/consignee_stock')
      .subscribe(d => {
        this.loading_list = false;
        console.log(d);
        this.stock = d.consignee;

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsConsDetail();
            });
      });
  }


  getbranchtransferstock() {
    this.loading_list = true;
    this.db.post_rqst(  { 'consignee_id':this.cons_id}, 'consignee/consigneeStockOutgoing')
      .subscribe(d => {
        console.log(d);
        this.loading_list = false;
        this.incoming = d;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchtransferstock();
            });
      });
  }





}
