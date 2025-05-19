import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {
  loadingTextValue!: string;
  @Input() set loadingText(value: string) {
    this.loadingTextValue = value;
  }
}
