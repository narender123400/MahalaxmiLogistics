import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormControl} from '@angular/forms';
import {SessionStorage} from '../../_services/SessionService';

@Component({
  selector: 'app-finish-manual-income',
  templateUrl: './finish-manual-income.component.html',
})
export class FinishManualIncomeComponent implements OnInit {

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
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,
    public matDialog: MatDialog,  public dialog: DialogComponent) {
}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.prod_id = params['id'];
      this.unit_id = params['unit_id'];

    
    if (this.prod_id) {
       this.getProductDetail(); 
      }
    });
  }

  product:any = {};
  vendor_item_data:any = {};
  unit:any = {};
  getProductDetail() {
    this.loading_list = true;
    this.db.post_rqst(  { 'id':this.prod_id,  'unit_id':this.unit_id,'type':'Finish' }, 'stock/manuallyStock')
      .subscribe(data => {
        this.loading_list = false;
        this.data = data;
        this.product = this.data.data.prod;
        console.log(this.product);
        
        this.vendor_item_data = this.data.data.stock;
        console.log(this.vendor_item_data);
        this.unit = this.data.data.unit;

      },err => {
        this.loading_list = false;

            this.dialog.retry().then((result) => {
                this.getProductDetail();
            });
      });
  }

}