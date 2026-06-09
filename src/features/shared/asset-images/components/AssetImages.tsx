import { getUserErrorMessage } from "../../../../shared/errors/AppError";
import { useAssetImages } from "../hooks/useAssetImages";

type AssetImagesProps = {
  itemId: number;
  itemtype: string;
  limit?: number;
  variant?: "gallery" | "thumbnail";
};

export function AssetImages({
  itemId,
  itemtype,
  limit,
  variant = "gallery",
}: AssetImagesProps) {
  const { error, imageUrls, isLoading } = useAssetImages({
    itemId,
    itemtype,
  });
  const visibleImages = limit ? imageUrls.slice(0, limit) : imageUrls;

  if (isLoading) {
    if (variant === "thumbnail") {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-(--panel-border) bg-(--panel-soft) text-xs text-(--text-secondary)">
          ...
        </div>
      );
    }

    return (
      <p className="text-sm text-(--text-secondary)">
        Chargement des images...
      </p>
    );
  }

  if (error) {
    if (variant === "thumbnail") {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-(--panel-border) bg-(--panel-soft) text-xs text-red-500">
          Erreur
        </div>
      );
    }

    return (
      <p className="text-sm text-red-500">
        {getUserErrorMessage(error, "Impossible de charger les images.")}
      </p>
    );
  }

  if (imageUrls.length === 0) {
    if (variant === "thumbnail") {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-dashed border-(--panel-border) bg-(--panel-soft) text-[10px] text-(--text-secondary)">
          Aucune
        </div>
      );
    }

    return (
      <p className="text-sm text-(--text-secondary)">
        Aucune image associée.
      </p>
    );
  }

  if (variant === "thumbnail") {
    const image = visibleImages[0];

    return (
      <div className="relative">
        <img
          alt="Image de l’équipement"
          className="h-16 w-16 rounded-[16px] border border-(--panel-border) object-cover"
          src={image.url}
        />
        {imageUrls.length > 1 ? (
          <span className="absolute -right-2 -top-2 rounded-full bg-(--accent-blue) px-2 py-0.5 text-[10px] font-semibold text-white">
            +{imageUrls.length - 1}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {visibleImages.map((image) => (
        <figure
          key={image.url}
          className="overflow-hidden rounded-[18px] border border-(--panel-border) bg-(--panel-soft)"
        >
          <img
            alt="Image de l’équipement"
            className="h-48 w-full object-cover"
            src={image.url}
          />
          <figcaption className="px-4 py-3 text-xs text-(--text-secondary)">
            Document #{image.documentId}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
