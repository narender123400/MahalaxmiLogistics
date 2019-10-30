import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {SessionStorage} from '../_services/SessionService';
import { DatabaseService } from '../_services/DatabaseService';

@Injectable()
export class AuthGuardLog implements CanActivate {
   users: any = [];
   constructor(private router: Router, public ses: SessionStorage, public db: DatabaseService) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            this.ses.getSe().subscribe(
              data => {
               this.users = data;
               },
               error => {
                  console.log('error');
            });


      if (this.users.logged) {

                   // this.ses.users.logged = false;

            var home_page = '';
            if(   this.users.access_level == 1  ){
                  home_page = '/sale-order-list';

            }else if(   this.users.access_level == 5   ){
                  home_page = '/branch-stock/'+this.users.branch_id;

            }else if(   this.users.access_level == 8 ){
                  home_page = '/consigner-stock/'+ this.users.consignor_id;

                
            }else{
      
            this.ses.logoutSession();

                  return;
            }

 
        this.router.navigate([ home_page ]);


        this.db.can_active = '1';
        return false;
       } else {
            this.db.can_active = '';
            return true;
       }
      }
}

