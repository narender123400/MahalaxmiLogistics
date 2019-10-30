import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from '../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import { BranchStockModelComponent } from '../branch-stock-model/branch-stock-model.component';

@Component({
  selector: 'app-branch-maintenance',
  templateUrl: './branch-maintenance.component.html',
})
export class BranchMaintenanceComponent implements OnInit {

  loading: any;
  products: any = [];
  unit_prices: any = [];
  attr_types: any = [];
  attr_options: any = [];
  data: any;
  search: any = '';
  loading_page = false;
  loading_list = false;
  loader: any = false;
  current_page = 1;
  last_page: number ;
  searchData = true;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public db: DatabaseService, private route: ActivatedRoute, public dialog: DialogComponent  , public dialogs: MatDialog  ) {  }

  franchise_id: any = '';
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loading_page = true;

    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];

    if (this.franchise_id) {
       this.getProductList();
    }
  });


  }


  openDialog(id, mode): void {
    const dialogRef = this.dialogs.open(BranchStockModelComponent, {
      width: '850px',
      data: {
        'id' : id,
        'mode' : mode,
        'branch_id' : this.franchise_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }




  redirect_previous() {
    this.current_page--;
    this.getProductList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getProductList();
  }
  getProductList() {
    this.loading_list = false;
    const typ = 'Product';
    this.db.post_rqst( {'branch_id': this.franchise_id } , 'branches/branch_maintenance?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
    
    // this.db.get_rqst(  '', 'products?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
      .subscribe(data => {
        console.log(data);
        this.loading_list = true;
        
        this.data = data;
        this.current_page = this.data.data.products.current_page;
        this.last_page = this.data.data.products.last_page;
        this.products = this.data.data.products.data;

        if(this.search && this.products.length < 1) { this.searchData = false; }
        else { this.searchData = true; }
      
      },err => {
            this.dialog.retry().then((result) => { this.getProductList(); });
      });
  }
  deleteProduct(p_id) {
    this.dialog.delete('Product').then((result) => {
      if(result) {
        this.db.post_rqst({p_id: p_id}, 'products/remove')
          .subscribe(data => {
            this.getProductList();
          });
       }
    },err => {
      this.dialog.retry().then((result) => { this.deleteProduct(p_id); });
});
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];


