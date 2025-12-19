import {ElementRef, Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TutorialAnchorRegistry {
  private anchors = new Map<string, ElementRef>();
  private version = signal(0);

  register(name: string, el: ElementRef) {
    this.anchors.set(name, el);
    this.version.update(v => v + 1);
  }

  unregister(name: string) {
    this.anchors.delete(name);
    this.version.update(v => v + 1);
  }

  get(name: string): ElementRef | undefined {
    this.version();
    return this.anchors.get(name);
  }
}
