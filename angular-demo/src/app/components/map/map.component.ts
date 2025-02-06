import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { mapInfoSelectedRegion } from "src/app/models/region";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnDestroy {
  map!: TrimbleMaps.Map;
  @Input() mapStyle = "TRANSPORTATION";
  @ViewChild("map", { static: true }) mapElement: ElementRef | undefined;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    const mapInfo = mapInfoSelectedRegion("na");
    this.mapService.apiKey$.subscribe((apiKey) => {
      if (apiKey) {
        this.map = this.mapService.initMap(
          {
            container: this.mapElement?.nativeElement,
            style: "transportation",
            center: mapInfo.center,
            zoom: mapInfo.zoom,
            hash: false,
            region: mapInfo.region,
          },
          apiKey
        );
      }
    });
  }
  ngOnDestroy() {
    this.mapService.removeAllEvent();
  }
}
