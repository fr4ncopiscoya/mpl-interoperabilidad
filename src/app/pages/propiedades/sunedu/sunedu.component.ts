import { Component } from '@angular/core';
import { PideService } from '../../../services/pide.service';

@Component({
  selector: 'app-sunedu',
  imports: [],
  templateUrl: './sunedu.component.html',
  styleUrl: './sunedu.component.css'
})
export default class SuneduComponent {

  constructor(private pideService: PideService) { }

  getSunedu(query: string) {
    const post = {
      nroDocIdentidad: query
    }

    this.pideService.getSunedu(post).subscribe({
      next: (res) => {
        console.log('resSunedu: ', res);
      },
      error: (error) => {
        console.log('error: ', error);
      }
    })
  }
}
