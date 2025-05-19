import { Component, OnDestroy, OnInit } from "@angular/core";
import { LicenseFeature } from "src/app/models/license";
import { StyleOption, mapStyleOptions } from "src/app/models/mapStyle";
import { MapService } from "src/app/services/map.service";
import { SubscriptionManager } from "src/app/utils/subscription-manager";

@Component({
  selector: "app-map-style",
  templateUrl: "./map-style.component.html",
  styleUrls: ["./map-style.component.scss"],
})
export class MapStyleComponent implements OnInit, OnDestroy {
  license!: LicenseFeature;
  constructor(private mapService: MapService) {}
  selectedStyle!: StyleOption;
  mapstyles: StyleOption[] = [];
  private sm = new SubscriptionManager();
  selectStyle() {
    this.mapService.changeStyle(
      this.selectedStyle.value,
      this.selectedStyle?.satelliteProvider
    );
  }
  ngOnInit() {
    this.sm.add(
      this.mapService.license$.subscribe((license) => {
        this.license = license;
        this.mapstyles = mapStyleOptions;
        this.selectedStyle = mapStyleOptions[0];
      })
    );
    this.sm.add(
      this.mapService.currentStyle$.subscribe((style) => {
        this.selectedStyle = this.mapstyles.filter(
          (value) => value.value === style
        )[0];
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
