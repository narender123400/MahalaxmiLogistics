import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-consignee-left-tab',
  templateUrl: './consignee-left-tab.component.html',
})
export class ConsigneeLeftTabComponent implements OnInit {

  franchise_id;
  tmp;
  frchise; 
  constructor(public db : DatabaseService,private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.franchise_id = params['franchise_id'];
      if(this.franchise_id) this.getConsignee_name();
    });
  }

  getConsignee_name() {
    this.db.get_rqst(  '','consignee/getConsignee_name/' + this.franchise_id )
    .subscribe(data => {
     this.tmp = data;
     this.db.franchise_name  = this.tmp.getData.consignee_name;
     this.db.franchise_location  = this.tmp.getData.location_id;
     console.log(  this.tmp.getData );
    });
  }

}