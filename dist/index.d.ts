import { ApolloLink, Operation, NextLink, Observable, FetchResult } from 'apollo-link';
import { ApolloCache } from 'apollo-cache';
export interface MaxAgeOptions {
    cache: ApolloCache<any>;
    toKey?: (op: Operation) => string;
}
export declare class MaxAgeLink extends ApolloLink {
    private options;
    scheduled: Map<string, Date>;
    constructor(options: MaxAgeOptions);
    request(op: Operation, forward: NextLink): Observable<FetchResult> | null;
    private shouldUseNetwork;
    private isExpired;
    private schedule;
    private toKey;
}
