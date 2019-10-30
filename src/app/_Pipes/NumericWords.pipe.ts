import { Pipe, PipeTransform } from '@angular/core';
import * as num from 'num-words';

@Pipe({ name: 'converToWord'})

export class NumericWords implements PipeTransform  {
    transform(amount:any = '',value:any = ''):any {
        if(!amount)return '';  
        return num(amount);
    }
    
}