import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { delay, finalize, identity, of, tap } from 'rxjs';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
        console.log(`Cache invalidated for ${key}`);
      }
    }
  }

  const cahceKey = generateCacheKey(req.url, req.params);

  if (req.method.includes('POST') && req.url.includes('/likes')) {
    invalidateCache('likes');
  }

  if (req.method.includes('POST') && req.url.includes('/messages')) {
    invalidateCache('messages');
  }

  if (req.method.includes('POST') && req.url.includes('/logout')) {
    cache.clear();
  }

  if (req.method == 'GET') {
    const cachedResponse = cache.get(cahceKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  const busyService = inject(BusyService);
  busyService.busy();
  return next(req).pipe(
    (environment.production ? identity : delay(500)),
    tap(
      response => {
        cache.set(cahceKey, response)
      }
    ),
    finalize(
      () => {
        busyService.idle()
      }
    )
  );
};
