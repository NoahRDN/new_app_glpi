import type { GlpiDataResourceId } from "./glpiDataResource.config";

export type GlpiResetResourceResult = {
  deletedCount: number;
  errors: Array<{
    id: number | string;
    message: string;
  }>;
  failedCount: number;
  resourceId: GlpiDataResourceId;
  totalFound: number;
};

export type GlpiResetResult = {
  resources: GlpiResetResourceResult[];
  totalDeleted: number;
  totalFailed: number;
};
