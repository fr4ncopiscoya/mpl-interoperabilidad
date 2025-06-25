import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultMessageService } from '../../services/result-message.service';

@Component({
  selector: 'app-result-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-message.component.html',
})
export class ResultMessageComponent {
  message: Signal<string>;
  style: Signal<string>;

  constructor(private resultService: ResultMessageService) {
    this.message = resultService.message;
    this.style = resultService.style;
  }
}
