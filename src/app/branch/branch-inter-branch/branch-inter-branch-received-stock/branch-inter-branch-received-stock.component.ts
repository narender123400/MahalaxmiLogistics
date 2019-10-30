import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../../_services/DatabaseService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from '../../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import { BranchStockModelComponent } from '../../branch-stock-model/branch-stock-model.component';

@Component({
  selector: 'app-branch-inter-branch-received-stock',
  templateUrl: './branch-inter-branch-received-stock.component.html',
})
export class BranchInterBranchReceivedStockComponent implements OnInit {

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

      console.log(this.franchise_id);
      

    if (this.franchise_id) {
      this.filter.stock_type = 'outgoing';
      this.filter.status = '';
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

  filter :any = {};
  getProductList() {
    this.loading_list = false;
    const typ = 'Product';
    this.filter.branch_id = this.franchise_id;

    this.db.post_rqst(  {'filter' : this.filter }, 'branches/branch_inter_received_stock_list?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
      .subscribe(data => {
        console.log(data);
        this.loading_list = true;
        
        this.data = data;
        // this.current_page = this.data.data.products.current_page;
        // this.last_page = this.data.data.products.last_page;
        this.products = this.data.data.salesInvoiceList.data;

        // if(this.search && this.products.length < 1) { this.searchData = false; }
        // else { this.searchData = true; }
      
      },err => {
        this.loading_list = true;
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


transferStockCancel(from_branch_id, id)
{
  this.dialog.delete('Item Data !').then((result) => {
    console.log(result);
    if(result){


    this.db.post_rqst( { 'from_branch_id':from_branch_id, 'id':id } , 'branches/CancelBranchInterStockTxransfer')
    .subscribe( r => {

      this.getProductList();
      this.dialog.success( 'Company to Branch Transfer Stock is Cancel Successfully!');

    });
}
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





