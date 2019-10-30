import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-franchise-left-tabs',
  templateUrl: './franchise-left-tabs.component.html'
})
export class FranchiseLeftTabsComponent implements OnInit {
  franchise_id;
  tmp;
  frchise; 
  constructor(public db : DatabaseService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      this.getFranchises_name();
    });
  }

  getFranchises_name() {
    this.db.get_rqst(  '', 'franchises/getFranchises_name/' + this.franchise_id )
    .subscribe(data => {
     this.tmp = data;
    //  this.db.franchise_name  = this.tmp.franchisenam.contact_name;
    //  this.db.franchise_location  = this.tmp.franchisenam.location_id;
     console.log(  this.tmp.franchisenam );
     console.log(  this.tmp.franchisenam.location_id );
    });
  }

}
