import {computed, effect, Injectable, signal} from '@angular/core';
import {TutorialStepConfig, TutorialStepId} from '../../../entities/tutorial.types';
import {GameStore} from '../stores/gameStore';
import {createTutorialConfig} from '../tutorial.config';
import {GameService} from './game/game.service';

@Injectable({providedIn: 'root'})
export class TutorialService {
  currentStepId = signal<TutorialStepId | null>(null);
  private readonly STORAGE_KEY = 'tutorial_completed';
  private steps: TutorialStepConfig[];
  private scrollContainers = new Map<string, HTMLElement>();
  private _bump = signal(0);
  currentStep = computed(() => {
    this._bump();
    return this.steps.find(s => s.id === this.currentStepId()) ?? null;
  });

  constructor(private store: GameStore, private game: GameService) {
    this.steps = createTutorialConfig(this.game, this.store);

    effect(
      () => {
        const step = this.currentStep();
        if (!step?.autoAdvance) return;

        this.store.session();

        if (this.currentStepId() !== step.id) return;

        if (step.isCompleted()) {
          if (step.next) this.currentStepId.set(step.next);
          else this.complete();
        }
      },
      {allowSignalWrites: true}
    );


  }

  scrollToInContainer(containerName: string, target: HTMLElement) {
    const container = this.scrollContainers.get(containerName);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const offset =
      targetRect.top -
      containerRect.top -
      containerRect.height / 2 +
      targetRect.height / 2;

    container.scrollBy({
      top: offset,
      behavior: 'smooth',
    });
  }

  registerScrollContainer(name: string, el: HTMLElement) {
    this.scrollContainers.set(name, el);
  }

  init() {
    if (localStorage.getItem(this.STORAGE_KEY)) return;

    const firstStep =
      window.innerWidth >= 1280 ? 'buy-sandwich' : 'open-menu';

    this.currentStepId.set(firstStep);
  }

  bump() {
    this._bump.update(v => v + 1);
  }

  tryAdvance() {
    const step = this.currentStep();
    if (!step) return;

    if (step.isCompleted()) {
      if (step.next) this.currentStepId.set(step.next);
      else this.complete();
    }
  }

  complete() {
    this.currentStepId.set(null);
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  isActive(anchor: string) {
    return this.currentStep()?.anchor === anchor;
  }
}
