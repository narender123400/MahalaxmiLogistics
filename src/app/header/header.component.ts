import { Component, OnInit, Renderer2  } from '@angular/core';
import {SessionStorage} from '../_services/SessionService';
import {Router} from '@angular/router';
import {DatabaseService} from './../_services/DatabaseService';
import {DialogComponent} from './../dialog/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  status = false;
  constructor(private renderer: Renderer2, private router: Router, public ses: SessionStorage, public db: DatabaseService , public dialog: DialogComponent) { }
  ngOnInit() {
  }
  toggleHeader() {
    this.status = !this.status;
    if (this.status) {
      this.renderer.addClass(document.body, 'active');
    } else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
  logout(): void {
    this.ses.logoutSession();
    this.router.navigate(['']);
  }






  keyword:any = 'full_name';
  data = [];
 
 
  selectEvent(item) {
    this.keyword = true;
    if(item.type == '1' )
    this.router.navigate(['/consumer_leads/details/'+item.id ]);
    if(item.type == '2' )
    this.router.navigate(['/franchise/customer_details/'+item.franchise_id+'/'+item.id ]);

  }
 
  onChangeSearch(val: string) {
      this.db.post_rqst(  {'search': val, 'login': this.db.datauser  }, 'customer/getConsumer')
      .subscribe(d => {
      this.data = d;

      console.log(  this.data );


      },err => {  this.dialog.retry().then((result) => { this.onChangeSearch(val); });   });


  }
  
  onFocused(e){
    // do something when input is focused
  }




  navigater(item) {
    console.log(item);
    
    if(item.title == "Franchise sales invoice" )
    this.router.navigate(['/order-invoice-detail/' + item.table_id ]);

    if(item.title == "Franchise sales order" )
    this.router.navigate(['/sale-order-detail/' + item.table_id ]);

    if(item.title == "Status Changes" && item.table == "consumers" )
    this.router.navigate(['/franchise_leads/details/' + item.table_id ]);

    if(item.title == "Status Changes" && item.table == "franchises" )
    this.router.navigate(['/consumer_leads/details/' + item.table_id ]);

    if(item.title == "Assign Sales Agents " && item.table == "franchise" )
    this.router.navigate(['/franchise_leads/details/' + item.table_id ]);;

    if(item.title == "Assign Sales Agents " && item.table == "consumers" )
    this.router.navigate(['/consumer_leads/details/' + item.table_id ]);

    if(item.title == "Schedule FollowUp" && item.table == "franchises" )
    this.router.navigate(['/franchise_leads/details/' + item.table_id ]);

    if(item.title == "Schedule FollowUp" && item.table == "consumers" )
    this.router.navigate(['/consumer_leads/details/' + item.table_id ]);

    if(item.title == "lead remark" && item.table == "franchises" )
    this.router.navigate(['/franchise_leads/details/' + item.table_id ]);

    if(item.title == "lead remark" && item.table == "consumers" )
    this.router.navigate(['/consumer_leads/details/' + item.table_id ]);
   
  }



}
