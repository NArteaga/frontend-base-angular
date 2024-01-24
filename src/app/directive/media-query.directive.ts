import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[MediaQuery]',
  standalone: true
})
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input() mediaQuery?: string;
  private mediaQueryList!: MediaQueryList;
  private isCreated!: boolean;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    if (!this.mediaQuery) return
    this.mediaQueryList = matchMedia(this.mediaQuery)
    fromEvent<any>(this.mediaQueryList, 'change')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(400),
        tap<MediaQueryListEvent>(({matches}) => this.update(matches))
      )
      .subscribe()
    this.update(this.mediaQueryList.matches)
  }



  update(match: boolean) {
    if (!match) return
    if (this.isCreated)
      this.viewContainerRef.clear()
    const ref = this.viewContainerRef.createEmbeddedView(this.templateRef)
    ref.markForCheck()
    this.isCreated = true
  }
}

