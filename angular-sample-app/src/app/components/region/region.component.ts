import { Component, OnDestroy, OnInit } from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { regions } from "src/app/models/region";
import { SelectOption } from "src/app/models/selectOption";
import { MapService } from "src/app/services/map.service";
import { SubscriptionManager } from "src/app/utils/subscription-manager";

@Component({
  selector: "app-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"],
})
export class RegionComponent implements OnInit, OnDestroy {
  regions!: SelectOption[];
  selectedRegion!: (typeof TrimbleMaps.Common.Region)[keyof typeof TrimbleMaps.Common.Region];
  euSupport = false;
  private sm = new SubscriptionManager();
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.sm.add(
      this.mapService.license$.subscribe((license) => {
        this.euSupport = license.euSupport;
        this.regions = regions;
      })
    );
    this.sm.add(
      this.mapService.currentRegion$.subscribe((region) => {
        this.selectedRegion = region;
      })
    );
  }
  selectRegion() {
    this.mapService.changeRegion(this.selectedRegion);
  }
  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
