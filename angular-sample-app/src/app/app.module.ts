import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrandingNameComponent } from "./components/branding-name/branding-name.component";
import { MapComponent } from "./components/map/map.component";
import { ContentPageComponent } from "./components/content-page/content-page.component";
import { RegionComponent } from "./components/region/region.component";
import { GetApiKeyModalComponent } from "./components/get-api-key-modal/get-api-key-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapStyleComponent } from "./components/map-style/map-style.component";
import { ContentLayersComponent } from "./components/content-layers/content-layers.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { RoutingComponent } from "./components/routing/routing.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ReportComponent } from "./components/report/report.component";
import { TimeWindowRoutingComponent } from "./components/time-window-routing/time-window-routing.component";
import { SiteLocationRoutingComponent } from "./components/site-location-routing/site-location-routing.component";
import { RailroutingComponent } from "./components/railrouting/railrouting.component";
import { LoadingModalComponent } from "./components/loading-modal/loading-modal.component";
import { ToastMsgComponent } from "./components/toast-msg/toast-msg.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TooltipComponent } from "./components/tooltip/tooltip.component";

@NgModule({ declarations: [
        AppComponent,
        BrandingNameComponent,
        MapComponent,
        ContentPageComponent,
        RegionComponent,
        GetApiKeyModalComponent,
        MapStyleComponent,
        ContentLayersComponent,
        RoutingComponent,
        ReportComponent,
        TimeWindowRoutingComponent,
        SiteLocationRoutingComponent,
        RailroutingComponent,
        LoadingModalComponent,
        ToastMsgComponent,
        TooltipComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
