import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private subject = new BehaviorSubject<any>(null);

  success(message: string, canDismiss = true): void {
    this.subject.next({
      type: "success",
      text: message,
      canDismiss,
    });
  }

  clear(messages?: any[]): void {
    this.subject.next(null);
    if (messages?.length === 0 || !messages) {
      this.subject.next(null);
    } else {
      this.subject.next(messages);
    }
  }

  error(message: string, canDismiss = false): void {
    this.subject.next({ type: "error", text: message, canDismiss });
  }

  warning(message: string, canDismiss: boolean): void {
    this.subject.next({ type: "warning", text: message, canDismiss });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
