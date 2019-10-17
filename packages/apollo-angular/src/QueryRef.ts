import {NgZone} from '@angular/core';
import {
  ApolloQueryResult,
  ObservableQuery,
  ApolloError,
  FetchMoreQueryOptions,
  FetchMoreOptions,
  SubscribeToMoreOptions,
  UpdateQueryOptions,
  ApolloCurrentQueryResult,
} from '@apollo/client/core';
import {Observable, from} from 'rxjs';
import {startWith, share} from 'rxjs/operators';

import {wrapWithZone, fixObservable} from './utils';
import {WatchQueryOptions, EmptyObject} from './types';

export class QueryRef<TData, TVariables = EmptyObject> {
  public valueChanges: Observable<ApolloQueryResult<TData>>;
  public options: ObservableQuery<TData, TVariables>['options'];

  constructor(
    private obsQuery: ObservableQuery<TData, TVariables>,
    ngZone: NgZone,
    options: WatchQueryOptions<TVariables>,
  ) {
    const wrapped = wrapWithZone(
      from(fixObservable(this.obsQuery)),
      ngZone,
    ).pipe(share());

    this.valueChanges = options.useInitialLoading
      ? wrapped.pipe(
          startWith({
            ...this.obsQuery.getCurrentResult(),
            error: undefined,
            partial: undefined,
            stale: true,
          }),
        )
      : wrapped;
  }

  // ObservableQuery's methods

  public get queryId(): ObservableQuery<TData, TVariables>['queryId'] {
    return this.obsQuery.queryId;
  }
  public get queryName(): ObservableQuery<TData, TVariables>['queryName'] {
    return this.obsQuery.queryName;
  }
  public get variables(): TVariables {
    return this.obsQuery.variables;
  }

  public result(): Promise<ApolloQueryResult<TData>> {
    return this.obsQuery.result();
  }

  public getCurrentResult(): ApolloCurrentQueryResult<TData> {
    return this.obsQuery.getCurrentResult();
  }

  public isDifferentFromLastResult(
    newResult: ApolloQueryResult<TData>,
  ): boolean {
    return this.obsQuery.isDifferentFromLastResult(newResult);
  }

  public getLastResult(): ApolloQueryResult<TData> {
    return this.obsQuery.getLastResult();
  }

  public getLastError(): ApolloError {
    return this.obsQuery.getLastError();
  }

  public resetLastResults(): void {
    return this.obsQuery.resetLastResults();
  }

  public refetch(variables?: TVariables): Promise<ApolloQueryResult<TData>> {
    return this.obsQuery.refetch(variables);
  }

  public fetchMore<K extends keyof TVariables>(
    fetchMoreOptions: FetchMoreQueryOptions<TVariables, K> &
      FetchMoreOptions<TData, TVariables>,
  ): Promise<ApolloQueryResult<TData>> {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }

  public subscribeToMore<TMoreData = any, TMoreVariables = EmptyObject>(
    options: SubscribeToMoreOptions<TData, TMoreVariables, TMoreData>,
  ): () => void {
    // XXX: there's a bug in @apollo/client typings
    // it should not inherit types from ObservableQuery
    return this.obsQuery.subscribeToMore(options as any);
  }
  public updateQuery(
    mapFn: (
      previousQueryResult: TData,
      options: UpdateQueryOptions<TVariables>,
    ) => TData,
  ): void {
    return this.obsQuery.updateQuery(mapFn);
  }

  public stopPolling(): void {
    return this.obsQuery.stopPolling();
  }

  public startPolling(pollInterval: number): void {
    return this.obsQuery.startPolling(pollInterval);
  }

  public setOptions(opts: any) {
    return this.obsQuery.setOptions(opts);
  }

  public setVariables(
    variables: TVariables,
    tryFetch: boolean = false,
    fetchResults = true,
  ) {
    return this.obsQuery.setVariables(variables, tryFetch, fetchResults);
  }
}
