import {inject, Injectable, signal} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ResidentPayload} from '../models/resident.models';
import {GET_ALL_RESIDENTS} from '../residents.graphql';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  private readonly apollo = inject(Apollo);


  readonly allResidents = signal<ResidentPayload[]>([]);



  getAllResidents() {
    this.apollo
      .watchQuery<{ allResidents: ResidentPayload[] }>({
        query: GET_ALL_RESIDENTS
      })
      .valueChanges
      .pipe(
        map(result => result.data.allResidents)
      )
      .subscribe({
        next: (residents) => {
          this.allResidents.set(residents);
        },
        error: (err) => {
          console.log('Error fetching residents: ', err)
        }
      });
  }
}
