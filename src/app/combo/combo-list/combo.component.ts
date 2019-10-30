import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html'
})
export class ComboComponent implements OnInit {


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
  constructor(public db: DatabaseService, public dialog: DialogComponent ) { this.getProductList(); }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loading_page = true;
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

  filtering : any = false;
  filter:any = {};
  getProductList() {
    this.loading_list = false;
    const typ = 'Product';

    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      
    if( this.filter.date  || this.filter.category ||  this.filter.search )this.filtering = true;
  

    this.db.post_rqst(  {'filter':this.filter}, 'products/combo_list?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
      .subscribe(data => {
        console.log(data);
        this.loading_list = true;
        
        this.data = data;
        this.current_page = this.data.data.combos.current_page;
        this.last_page = this.data.data.combos.last_page;
        this.products = this.data.data.combos.data;

        if(this.search && this.products.length < 1) { this.searchData = false; }
        else { this.searchData = true; }
      
      },err => {
            this.dialog.retry().then((result) => { this.getProductList(); });
      });
  }
  deleteProduct(p_id) {
    this.dialog.delete('Combo').then((result) => {
      if(result) {
        this.db.post_rqst({ 'p_id' : p_id}, 'products/combo_remove')
          .subscribe(data => {
            this.dialog.success('Combo Deleted Successfully!')
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




