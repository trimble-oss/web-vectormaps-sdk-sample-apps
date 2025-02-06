import { Injectable } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { LoadingModalComponent } from "./loading-modal/loading-modal.component";
import { GetApiKeyModalComponent } from "./get-api-key-modal/get-api-key-modal.component";
import { MapService } from "../services/map.service";
import { ReportComponent } from "./report/report.component";
import { MapRegion } from "../models/trimbleMaps";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  loadingModal: any;

  constructor(
    private modalService: BsModalService,
    private mapService: MapService
  ) {}
  addLoading(text: string) {
    this.loadingModal = this.modalService.show(LoadingModalComponent, {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: { loadingText: text },
      class: "modal-dialog-centered",
    });
  }
  hideLoading() {
    this.modalService.hide(this.loadingModal?.id);
  }

  openAPIKeyModal() {
    const modal = this.modalService.show(GetApiKeyModalComponent, {
      ignoreBackdropClick: true,
      keyboard: false,
      class: "modal-dialog-centered",
    });

    modal.content?.apiKey$.subscribe((key) => {
      this.mapService.apiKey.next(key);
      this.modalService.hide(modal.id);
    });
  }

  showReports(routeReports: any, dataVersion: MapRegion) {
    this.modalService.show(ReportComponent, {
      class: "modal-xl reports-modal modal-dialog-scrollable",
      ignoreBackdropClick: true,
      initialState: {
        routeReports: routeReports,
        region: dataVersion,
      },
    });
  }
}
