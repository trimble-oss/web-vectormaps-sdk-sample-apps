import { Component, OnInit } from "@angular/core";
import { Observable, tap } from "rxjs";
import * as _ from "lodash";
import { ToastService } from "src/app/services/toast.service";
import { ToastMsg } from "src/app/models/toastMsg";

@Component({
  selector: "app-toast-msg",
  templateUrl: "./toast-msg.component.html",
  styleUrls: ["./toast-msg.component.scss"],
})
export class ToastMsgComponent implements OnInit {
  constructor(private toastService: ToastService) {}
  message$!: Observable<ToastMsg>;
  ngOnInit() {
    this.message$ = this.toastService.getMessage().pipe(
      tap((message) => {
        if (!_.isEmpty(message)) {
          return message;
        } else {
          return null;
        }
      })
    );
  }
  closeToast() {
    this.toastService.clear();
  }
}
