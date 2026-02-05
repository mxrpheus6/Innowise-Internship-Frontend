import { authApi } from './auth';
import type { ItemResponse } from '../types/items';
import { config } from '../config';

export const itemsApi = {
  async getAll(): Promise<ItemResponse[]> {
    return authApi.request<ItemResponse[]>(config.endpoints.items.base);
  },
};