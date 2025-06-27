import { Component, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';

@Component({
  selector: 'app-judiciales',
  imports: [],
  templateUrl: './judiciales.component.html',
  styleUrl: './judiciales.component.css'
})
export default class JudicialesComponent {

  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombre = signal<string>('');

  constructor(private pideService:PideService){

  }

  searchAntJudiciales(){
    
  }

}
