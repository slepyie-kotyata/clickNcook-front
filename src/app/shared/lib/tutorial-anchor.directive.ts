import {Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges,} from '@angular/core';
import {TutorialAnchorRegistry} from './tutorial-anchor.registry';

@Directive({
  selector: '[tutorialAnchor]',
  standalone: true,
})
export class TutorialAnchorDirective implements OnChanges, OnDestroy {
  @Input('tutorialAnchor') name: string | null = null;

  private registeredName: string | null = null;

  constructor(
    private el: ElementRef,
    private registry: TutorialAnchorRegistry
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('name' in changes) {
      if (this.registeredName) {
        this.registry.unregister(this.registeredName);
        this.registeredName = null;
      }

      if (this.name) {
        this.registry.register(this.name, this.el);
        this.registeredName = this.name;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.registeredName) {
      this.registry.unregister(this.registeredName);
    }
  }
}
