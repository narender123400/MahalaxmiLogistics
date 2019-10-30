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
  selector: 'app-finish-material-detail',
  templateUrl: './finish-material-detail.component.html'
})
export class FinishMaterialDetailComponent implements OnInit {

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
      // this.unit_id = params['unit_id'];

    
    if (this.prod_id) {
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
  branchs:any = [];
  consigners:any = [];
  getProductDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id }, 'stock/getFinishGoodDetail')
      .subscribe(d => {
        console.log(d);
        this.loading_list = false;
        this.product = d.data.prod;
        this.porducFinishGood = d.data.finish_good;
        this.branchs = d.data.branch;
        
console.log( this.consigners);

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getProductDetail();
            });
      });
  }



  item_detail :any = {};
  stockOutgoing :any = [];

  companyStockOutgoing() {

    
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id  }, 'stockdata/companyStockOutgoing')
      .subscribe( d => {
        this.loading_list = false;
        console.log( d );

        // this.item_detail = d.item_detail;
        this.stockOutgoing = d.stockOutgoing;

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.companyStockOutgoing();
            });
      });
  }

  Manually_incoming :any = [];

  manuallyIncoming() {

    this.loading_list = true;
    this.db.post_rqst( { 'id':this.prod_id  }, 'stockdata/manullayIncomingStock')
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









  getbranchsDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'mode' : '1' }, 'stock/getFinishGoodDetail')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.branchs = this.data.data.branch;
        console.log(this.data);
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsDetail();
            });
      });
  }





  getbranchsConsDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id , 'mode' : '2' }, 'stock/getFinishGoodDetail')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.branchs = this.data.data.branch;
        console.log(this.data);
        this.consigners = this.data.data.consigner;
        

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getbranchsConsDetail();
            });
      });
  }




}