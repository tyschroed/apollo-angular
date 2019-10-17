import {Injectable} from '@angular/core';
import {FetchResult} from '@apollo/client/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {MutationOptionsAlone, EmptyObject} from './types';

@Injectable()
export class Mutation<TData = {}, TVariables = EmptyObject> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public mutate(
    variables?: TVariables,
    options?: MutationOptionsAlone<TData, TVariables>,
  ): Observable<FetchResult<TData>> {
    return this.apollo.use(this.client).mutate<TData, TVariables>({
      ...options,
      variables,
      mutation: this.document,
    });
  }
}
