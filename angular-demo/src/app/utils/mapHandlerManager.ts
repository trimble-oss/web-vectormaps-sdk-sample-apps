
export interface MapHandler {
  eventName: string;
  listener: (ev: any) => void;
}

export class MapHandlerManager {
  private map!: TrimbleMaps.Map;
  private mapHandlers = new Map<string, MapHandler>();

  setMap(map: TrimbleMaps.Map) {
    this.map = map;
  }

  add(handler: MapHandler): string | undefined {
    if (!this.map) {
      console.warn(
        'Handler cannot be added. The map has not been set for this manager.'
      );
      return;
    }
    this.map.on(handler.eventName, handler.listener);

    const id = handler.eventName + Date.now();
    this.mapHandlers.set(id, handler);

    return id;
  }

  remove(id: string) {
    const handler = this.mapHandlers.get(id);
    if (handler) {
      this.map.off(handler.eventName, handler.listener);
    }
    this.mapHandlers.delete(id);
  }

  removeAll() {
    this.mapHandlers.forEach((handler) => {
      this.map.off(handler.eventName, handler.listener);
    });

    this.mapHandlers.clear();
  }
}
