import { Component, ElementRef, Input, ViewChild } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-alert-modal',
  imports: [],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {

  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';

  @ViewChild('modalRef') modalElement!: ElementRef;

  private modalInstance: any;

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement, {
      backdrop: 'static', // evita cierre al hacer clic fuera
      keyboard: false      // evita cierre con tecla ESC
    });
  }

  open() {
    this.modalInstance?.show();
  }

  close() {
    this.modalInstance?.hide();
  }

}
