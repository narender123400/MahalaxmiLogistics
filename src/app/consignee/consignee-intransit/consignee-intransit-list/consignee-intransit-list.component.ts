import {Component, OnInit} from '@angular/core';
import {DatabaseService} from './../../../_services/DatabaseService';
import {DialogComponent} from './../../../dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-consignee-intransit-list',
  templateUrl: './consignee-intransit-list.component.html'
})
export class ConsigneeIntransitListComponent implements OnInit {
  
  loading: any;
  products: any = [];
  unit_prices: any = [];
  attr_types: any = [];
  
  stock_total: any = [];
  stock_qty: any = [];
  
  attr_options: any = [];
  data: any;
  search: any = '';
  loading_page = false;
  loading_list = false;
  loader: any = false;
  current_page = 1;
  last_page: number ;
  searchData = true;
  
  constructor(public db: DatabaseService, public dialog: DialogComponent , private route: ActivatedRoute) {  }
  franchise_id:any = '';
  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];

    if (this.franchise_id) {
       this.getProductList();
    }
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
  filtering : any = false;
  filter:any = {};

  getProductList() {
    this.loading_list = true;
    const typ = 'Product';

    this.loading_list = true;
    this.filter.status = status;
    
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';

    
    if( this.filter.date  || this.filter.status ||  this.filter.search )this.filtering = true;

    this.db.post_rqst(  {'consignee_id':this.franchise_id}, 'sales/consigner_intransit?page=' + this.current_page + '&s=' + this.search + '&t=' + typ)
      .subscribe(data => {
        console.log(data);
        this.loading_list = false;
        
        this.data = data;
        // this.current_page = this.data.data.products.current_page;
        // this.last_page = this.data.data.products.last_page;
        this.products = this.data.data.salesInvoiceList.data;

        // if(this.search && this.products.length < 1) { this.searchData = false; }
        // else { this.searchData = true; }
      
      },err => {
        this.loading_list = false;
            this.dialog.retry().then((result) => { this.getProductList(); });
      });
  }


active:any = {};
edit_qty(index)
{
  console.log(index);
  
  this.active[index] = Object.assign({'qty' : 1});
  
  console.log(this.active);
  
}


}
