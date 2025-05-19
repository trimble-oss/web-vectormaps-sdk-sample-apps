import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { LicenseFeature } from "src/app/models/license";
import { MapService } from "src/app/services/map.service";
import { constants } from "src/app/utils/constants";
import { SubscriptionManager } from "src/app/utils/subscription-manager";

@Component({
  selector: "app-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
})
export class TooltipComponent implements OnInit, OnDestroy {
  unlicensed_msg = constants.UNLICENSED_MSG;
  private sm = new SubscriptionManager();
  @Input() showTooltip = false;
  license!: LicenseFeature;
  constructor(private mapService: MapService) {}
  ngOnInit() {
    this.sm.add(
      this.mapService.license$.subscribe((license) => {
        this.license = license;
      })
    );
  }
  isLicenseNotEmpty(): boolean {
    return Object.keys(this.license).length > 0;
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
