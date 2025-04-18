import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const mobileGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  if (isMobile) {
    router.navigate(['/mobile-not-supported']);
    return false;
  }

  return true;
};
