import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-get-api-key-modal",
  templateUrl: "./get-api-key-modal.component.html",
  styleUrls: ["./get-api-key-modal.component.scss"],
})
export class GetApiKeyModalComponent {
  apiKey!: string;
  @Output() apiKey$ = new EventEmitter<string>();

  submit() {
    this.apiKey$.emit(this.apiKey);
  }
}
