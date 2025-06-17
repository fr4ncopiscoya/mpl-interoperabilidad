import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bienvenido',
  imports: [NgxSpinnerComponent],
  providers:[NgxSpinnerService], 
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export default class BienvenidoComponent {

  constructor(
    private spinner: NgxSpinnerService,
  ) {
    this.spinner.show()
  }

}
