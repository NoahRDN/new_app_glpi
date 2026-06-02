import { assetsMock } from "../../../entities/asset/model/asset.mock";
import { Badge } from "../../../shared/ui/Badge";
import { Card } from "../../../shared/ui/Card";

export function AssetGrid() {
  return (
    <>
      {assetsMock.map((asset) => (
        <Card
          className="md:col-span-6 xl:col-span-4"
          key={asset.id}
          title={asset.name}
          description={`${asset.type} • ${asset.location}`}
        >
          <div className="flex flex-col gap-2.5">
            <Badge tone={asset.status === "in_service" ? "success" : "warning"}>
              {asset.status}
            </Badge>
            <p className="text-sm text-slate-500">Assigne a {asset.assignedTo}</p>
          </div>
        </Card>
      ))}
    </>
  );
}
