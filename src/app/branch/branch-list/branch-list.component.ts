import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
})
export class BranchListComponent implements OnInit {

  loading: any;
  data: any;
  source: any = '';
  loading_page = false;
  loading_list = false;
  loader: any = false;
  branches: any = [];
  locations: any = [];
  total_branches = 0;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public db: DatabaseService, public dialog: DialogComponent ) { this.getBranchesList(); }
  ngOnInit()
  {
    this.dataSource.paginator = this.paginator;
    this.loading_page = true;
  }

  last_page: number ;
  current_page = 1;
  search: any = '';
  searchData = true;
  isInvoiceDataExist = false;
  filter:any = {};
  filtering : any = false;

  redirect_previous() {
    this.current_page--;
    this.getBranchesList();
  }
  redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getBranchesList();
  }

  getBranchesList() 
  {
    this.isInvoiceDataExist = false;
    this.loading_list = false;
          
    this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
    if( this.filter.date || this.filter.location_id )this.filtering = true;

    this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'branches/getBranches?page=' + this.current_page + '&s=' + this.search + '&source=' + this.source)
      .subscribe(data => {
        console.log(data);
        
        this.data = data;
        this.current_page = this.data.data.branches.current_page;
        this.last_page = this.data.data.branches.last_page;
        this.total_branches = this.data.data.branches.total;
        this.branches = this.data.data.branches.data;
        this.loading_list = true;
      },err => {this.dialog.retry().then((result) => {this.getBranchesList(); console.log(err); });  
      });
  }
  orderListReverse(){
    this.branches=this.branches.reverse();
  }

 }

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];