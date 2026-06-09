import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocumentFileBlob } from "../../../../entities/document/api/document.api";
import { getDocumentItemsByAsset } from "../../../../entities/document/api/documentItem.api";

type UseAssetImagesParams = {
  itemId: number;
  itemtype: string;
};

export function useAssetImages(params: UseAssetImagesParams) {
  const query = useQuery({
    enabled: params.itemId > 0 && params.itemtype.trim().length > 0,
    queryKey: ["asset-images", params.itemtype, params.itemId],
    queryFn: async () => {
      const documentItems = await getDocumentItemsByAsset({
        itemId: params.itemId,
        itemtype: params.itemtype,
      });

      console.log("Recherche images asset:", {
        documentItems,
        itemId: params.itemId,
        itemtype: params.itemtype,
      });

      const documentIds = [...new Set(
        documentItems
          .map((documentItem) => documentItem.documents_id)
          .filter((documentId): documentId is number => typeof documentId === "number"),
      )];

      return Promise.all(
        documentIds.map(async (documentId) => ({
          blob: await getDocumentFileBlob(documentId),
          documentId,
        })),
      );
    },
  });

  const imageUrls = useMemo(
    () => (query.data ?? []).map((item) => ({
      documentId: item.documentId,
      url: URL.createObjectURL(item.blob),
    })),
    [query.data],
  );

  useEffect(() => {
    return () => {
      imageUrls.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [imageUrls]);

  return {
    error: query.error,
    imageUrls,
    isLoading: query.isPending,
  };
}
