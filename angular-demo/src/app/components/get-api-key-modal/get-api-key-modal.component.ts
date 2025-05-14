import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MapService } from "src/app/services/map.service";
import { constants } from "src/app/utils/constants";

@Component({
  selector: "app-get-api-key-modal",
  templateUrl: "./get-api-key-modal.component.html",
  styleUrls: ["./get-api-key-modal.component.scss"],
})
export class GetApiKeyModalComponent implements OnInit {
  apiKey!: string;
  @Output() apiKey$ = new EventEmitter<string>();
  apiError!: boolean;
  apiError_msg = constants.API_ERROR_MSG;
  constructor(private mapService: MapService) {}
  ngOnInit() {
    this.mapService.apiKeyError$.subscribe((error) => {
      if (error) {
        this.apiError = true;
      }
    });
  }
  submit() {
    this.apiKey$.emit(this.apiKey);
  }
}
