import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Overlay, ComponentType, OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';

export interface DialogConfig {
  data?: any;
}

export class DialogRef {
  private afterClosedSubject = new Subject<any>();

  constructor(private overlayRef: OverlayRef) {}

  /**
   * Closes the overlay. You can optionally provide a result.
   */
  public close(result?: any) {
    this.overlayRef.dispose();
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  /**
   * An Observable that notifies when the overlay has closed
   */
  public afterClosed(): Observable<any> {
    return this.afterClosedSubject.asObservable();
  }
}

export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}

  /**
   * Open a custom component in an overlay
   */
  open<T>(component: ComponentType<T>, config?: DialogConfig): DialogRef {
    // Globally centered position strategy
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    // Create the overlay with customizable options
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel'
    });

    // Create dialogRef to return
    const dialogRef = new DialogRef(overlayRef);

    // Create injector to be able to reference the DialogRef from within the component
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: config?.data }
      ]
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    // Close dialog on backdrop click
    overlayRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });

    // Close dialog on Escape key press
    const escapeKeyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dialogRef.close();
        document.removeEventListener('keydown', escapeKeyListener);
      }
    };

    document.addEventListener('keydown', escapeKeyListener);

    return dialogRef;
  }
}
