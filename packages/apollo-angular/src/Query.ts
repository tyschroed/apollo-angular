import {Injectable} from '@angular/core';
import {ApolloQueryResult} from '@apollo/client/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

import {Apollo} from './Apollo';
import {QueryRef} from './QueryRef';
import {WatchQueryOptionsAlone, QueryOptionsAlone, EmptyObject} from './types';

@Injectable()
export class Query<TData = {}, TVariables = EmptyObject> {
  public readonly document: DocumentNode;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watch(
    variables?: TVariables,
    options?: WatchQueryOptionsAlone<TVariables>,
  ): QueryRef<TData, TVariables> {
    return this.apollo.use(this.client).watchQuery<TData, TVariables>({
      ...options,
      variables,
      query: this.document,
    });
  }

  public fetch(
    variables?: TVariables,
    options?: QueryOptionsAlone<TVariables>,
  ): Observable<ApolloQueryResult<TData>> {
    return this.apollo.use(this.client).query<TData, TVariables>({
      ...options,
      variables,
      query: this.document,
    });
  }
}
