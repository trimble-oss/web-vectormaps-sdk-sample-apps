import { Subscription } from 'rxjs';

export class SubscriptionManager {
    private subscriptions: Subscription[] = [];

    add(...subscriptions: Subscription[]): void {
        this.subscriptions.push(...subscriptions);
    }

    unsubscribe(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
