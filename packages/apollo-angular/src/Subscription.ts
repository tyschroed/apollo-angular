import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {
  SubscriptionOptionsAlone,
  ExtraSubscriptionOptions,
  SubscriptionResult,
  EmptyObject,
} from './types';

@Injectable()
export class Subscription<TData = any, TVariables = EmptyObject> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public subscribe(
    variables?: TVariables,
    options?: SubscriptionOptionsAlone<TVariables>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<SubscriptionResult<TData>> {
    return this.apollo.use(this.client).subscribe<TData, TVariables>(
      {
        ...options,
        variables,
        query: this.document,
      },
      extra,
    );
  }
}
