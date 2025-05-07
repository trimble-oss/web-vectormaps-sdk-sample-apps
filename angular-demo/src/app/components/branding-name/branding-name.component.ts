import { Component, Input, HostBinding, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-branding-name",
  templateUrl: "./branding-name.component.html",
  styles: [
    `
      .app-logo {
        height: 28px;
      }

      h1.app-name {
        font-weight: 400;
        color: #004f83;
        font-size: 22px;
        position: relative;
        margin-bottom: 1px;
      }

      h1.app-name-white {
        color: #fff !important;
      }
      .set-cursor {
        cursor: pointer;
      }
    `
  ]
})
export class BrandingNameComponent implements OnInit {
  @HostBinding("class") class = "me-auto";
  @Input() appName?: string;
  @Input() logoPath?: string;
  @Input() logoAlt?: string;
  @Input() beta = false;
  @Input() isClickable = false;
  isBlue = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.isBlue = document.querySelectorAll(".navbar-blue").length > 0;
  }
  navigateToRoutePage() {
    this.router.navigate(["/app"]);
  }
}
