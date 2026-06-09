import { useState } from "react";
import { deleteGlpiResourceItem, getGlpiResourceItems } from "../api/glpiDataResource.api";
import { getGlpiDataResource, type GlpiDataResourceId } from "../model/glpiDataResource.config";
import type { GlpiResetResult, GlpiResetResourceResult } from "../model/glpiDataReset.types";

export function useResetGlpiData() {
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<GlpiResetResult | null>(null);

  async function resetResources(resourceIds: GlpiDataResourceId[]) {
    setError("");
    setIsResetting(true);
    setResult(null);

    const results: GlpiResetResourceResult[] = [];

    for (const resourceId of resourceIds) {
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

          if (item.is_deleted === true) {
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
            await deleteGlpiResourceItem(resource, item.id);
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

    setResult({
      resources: results,
      totalDeleted: results.reduce((total, item) => total + item.deletedCount, 0),
      totalFailed: results.reduce((total, item) => total + item.failedCount, 0),
    });
    setIsResetting(false);
  }

  return {
    error,
    isResetting,
    resetResources,
    result,
  };
}
