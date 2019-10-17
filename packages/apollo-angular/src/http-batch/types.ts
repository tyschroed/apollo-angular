import {Options} from '../http/types';
import {Operation} from '@apollo/client/core';

export type BatchOptions = {
  batchMax?: number;
  batchInterval?: number;
  batchKey?: (operation: Operation) => string;
} & Options;
