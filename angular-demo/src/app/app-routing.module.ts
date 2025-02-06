import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegionComponent } from "./components/region/region.component";
import { MapStyleComponent } from "./components/map-style/map-style.component";
import { ContentLayersComponent } from "./components/content-layers/content-layers.component";
import { RoutingComponent } from "./components/routing/routing.component";
import { TimeWindowRoutingComponent } from "./components/time-window-routing/time-window-routing.component";
import { SiteLocationRoutingComponent } from "./components/site-location-routing/site-location-routing.component";
import { RailroutingComponent } from "./components/railrouting/railrouting.component";

const routes: Routes = [
  { path: "", redirectTo: "selectRegion", pathMatch: "full" },
  { path: "selectRegion", component: RegionComponent },
  { path: "mapStyle", component: MapStyleComponent },
  { path: "contentLayers", component: ContentLayersComponent },
  { path: "routing", component: RoutingComponent },
  { path: "timeWindowRouting", component: TimeWindowRoutingComponent },
  { path: "siteLocationRouting", component: SiteLocationRoutingComponent },
  { path: "railRouting", component: RailroutingComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
