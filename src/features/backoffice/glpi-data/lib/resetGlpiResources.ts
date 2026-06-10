import {
  DEFAULT_RESET_FORCE_DELETE,
  deleteGlpiResourceItem,
  getGlpiResourceItems,
} from "../api/glpiDataResource.api";
import { getGlpiDataResource, type GlpiDataResourceId } from "../model/glpiDataResource.config";
import type { GlpiResetResult, GlpiResetResourceResult } from "../model/glpiDataReset.types";

export async function resetGlpiResources(params: {
  forceDelete?: boolean;
  resourceIds: GlpiDataResourceId[];
}): Promise<GlpiResetResult> {
  const forceDelete = params.forceDelete ?? DEFAULT_RESET_FORCE_DELETE;
  const results: GlpiResetResourceResult[] = [];

  for (const resourceId of params.resourceIds) {
    const resource = getGlpiDataResource(resourceId);
    const errors: GlpiResetResourceResult["errors"] = [];
    let deletedCount = 0;
    let totalFound = 0;

    try {
      const items = await getGlpiResourceItems(resource);

      for (const item of items) {
        if (item.id === undefined) {
          errors.push({
            id: "unknown",
            message: "Ligne sans identifiant id.",
          });
          continue;
        }

        if (!forceDelete && item.is_deleted === true) {
          continue;
        }

        totalFound = items.length;

        try {
          const itemIsProtected = resource.protectedIds?.includes(item.id);

          if (itemIsProtected !== undefined && itemIsProtected) {
            errors.push({
              id: item.id,
              message: resource.reason ?? "",
            });
            continue;
          }

          await deleteGlpiResourceItem(resource, item.id, {
            forceDelete,
          });
          deletedCount += 1;
        } catch (caughtError) {
          errors.push({
            id: item.id,
            message: caughtError instanceof Error ? caughtError.message : String(caughtError),
          });
        }
      }
    } catch (caughtError) {
      errors.push({
        id: "resource",
        message: caughtError instanceof Error ? caughtError.message : String(caughtError),
      });
    }

    results.push({
      deletedCount,
      errors,
      failedCount: errors.length,
      resourceId,
      totalFound,
    });
  }

  return {
    resources: results,
    totalDeleted: results.reduce((total, item) => total + item.deletedCount, 0),
    totalFailed: results.reduce((total, item) => total + item.failedCount, 0),
  };
}
