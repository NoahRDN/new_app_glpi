import { useState } from "react";
import { DEFAULT_RESET_FORCE_DELETE } from "../api/glpiDataResource.api";
import { resetGlpiResources } from "../lib/resetGlpiResources";
import type { GlpiDataResourceId } from "../model/glpiDataResource.config";
import type { GlpiResetResult } from "../model/glpiDataReset.types";

export function useResetGlpiData() {
  const [error, setError] = useState("");
  const [forceDelete, setForceDelete] = useState(DEFAULT_RESET_FORCE_DELETE);
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<GlpiResetResult | null>(null);

  async function resetResources(resourceIds: GlpiDataResourceId[]) {
    setError("");
    setIsResetting(true);
    setResult(null);

    try {
      const resetResult = await resetGlpiResources({
        forceDelete,
        resourceIds,
      });
      setResult(resetResult);
    } finally {
      setIsResetting(false);
    }
  }

  return {
    error,
    forceDelete,
    isResetting,
    resetResources,
    result,
    setForceDelete,
  };
}
