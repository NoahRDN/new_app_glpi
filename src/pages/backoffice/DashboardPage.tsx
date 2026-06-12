import {
  Blocks,
  ClipboardList,
  Computer,
  KeyRound,
  Monitor,
  Network,
  Phone,
  Printer,
  Siren,
  Server,
  RefreshCcw,
  Tickets,
} from "lucide-react";
import { useDashboardStats } from "../../features/backoffice/dashboard/hooks/useDashboardStats";
import { InventorySummaryGrid, type InventorySummaryItem } from "../../shared/ui/InventorySummaryGrid";
import { Button } from "../../shared/ui/Button";

const INVENTORY_TILE_DEFINITIONS = [
  {
    accentColor: "#2d8c43",
    aliases: ["Software", "Logiciel"],
    backgroundColor: "#b8e5b6",
    icon: Blocks,
    id: "software",
    label: "Logiciel",
  },
  {
    accentColor: "#8e2b2f",
    aliases: ["Computer", "Ordinateurs", "Ordinateur"],
    backgroundColor: "#e58f92",
    icon: Computer,
    id: "computer",
    label: "Ordinateurs",
  },
  {
    accentColor: "#3197a8",
    aliases: ["NetworkEquipment", "Matériel réseau", "Network"],
    backgroundColor: "#b7e6ee",
    icon: Network,
    id: "network",
    label: "Matériel réseau",
  },
  {
    accentColor: "#487db6",
    aliases: ["Phone", "Téléphones", "Téléphone"],
    backgroundColor: "#cfdded",
    icon: Phone,
    id: "phone",
    label: "Téléphones",
  },
  {
    accentColor: "#f1fff5",
    aliases: ["SoftwareLicense", "Licence", "Licences"],
    backgroundColor: "#27b437",
    icon: KeyRound,
    id: "license",
    label: "Licence",
  },
  {
    accentColor: "#fff5f5",
    aliases: ["Monitor", "Moniteur", "Moniteurs"],
    backgroundColor: "#c12e32",
    icon: Monitor,
    id: "monitor",
    label: "Moniteurs",
  },
  {
    accentColor: "#8fe2ef",
    aliases: ["Rack", "Baie", "Baies"],
    backgroundColor: "#1f8faa",
    icon: Server,
    id: "rack",
    label: "Baie",
  },
  {
    accentColor: "#d9e6ff",
    aliases: ["Printer", "Imprimante", "Imprimantes"],
    backgroundColor: "#4468a5",
    icon: Printer,
    id: "printer",
    label: "Imprimante",
  },
] as const;

const TICKET_TILE_DEFINITIONS = [
  {
    accentColor: "#6546b8",
    aliases: ["Tickets", "Total tickets"],
    backgroundColor: "#d9d1f6",
    icon: Tickets,
    id: "tickets-total",
    label: "Tickets",
  },
  {
    accentColor: "#ad4a20",
    aliases: ["Incidents", "incidents"],
    backgroundColor: "#f4c8b4",
    icon: Siren,
    id: "tickets-incidents",
    label: "Incidents",
  },
  {
    accentColor: "#2e7992",
    aliases: ["Demandes", "requests"],
    backgroundColor: "#c5e7ef",
    icon: ClipboardList,
    id: "tickets-requests",
    label: "Demandes",
  },
] as const;

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export function DashboardPage() {
  const {
    data: stats,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboardStats();

  if (isPending) {
    return <p>Chargement du dashboard...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Impossible de charger les statistiques du dashboard.</p>
        {import.meta.env.DEV && (
          <pre className="text-xs">{error instanceof Error ? error.message : String(error)}</pre>
        )}
      </div>
    );
  }

  if (!stats) {
    return <p>Aucune statistique disponible.</p>;
  }

  const assetCountsByKey = new Map<string, number>();

  stats.assetsByType.forEach((item) => {
    assetCountsByKey.set(normalizeValue(item.key), item.count);
    assetCountsByKey.set(normalizeValue(item.label), item.count);
  });

  const inventoryItems: InventorySummaryItem[] = INVENTORY_TILE_DEFINITIONS.map((definition) => {
    const matchedCount = definition.aliases.reduce<number | null>((currentCount, alias) => {
      if (currentCount !== null) {
        return currentCount;
      }

      return assetCountsByKey.get(normalizeValue(alias)) ?? null;
    }, null);

    return {
      accentColor: definition.accentColor,
      backgroundColor: definition.backgroundColor,
      Icon: definition.icon,
      id: definition.id,
      label: definition.label,
      value: matchedCount ?? 0,
    };
  });

  const ticketCountsByKey = new Map<string, number>();

  stats.ticketsByType.forEach((item) => {
    ticketCountsByKey.set(normalizeValue(item.key), item.count);
    ticketCountsByKey.set(normalizeValue(item.label), item.count);
  });

  const ticketItems: InventorySummaryItem[] = TICKET_TILE_DEFINITIONS.map((definition) => {
    const value =
      definition.id === "tickets-total"
        ? stats.totalTickets
        : definition.aliases.reduce<number | null>((currentCount, alias) => {
            if (currentCount !== null) {
              return currentCount;
            }

            return ticketCountsByKey.get(normalizeValue(alias)) ?? null;
          }, null) ?? 0;

    return {
      accentColor: definition.accentColor,
      backgroundColor: definition.backgroundColor,
      Icon: definition.icon,
      id: definition.id,
      label: definition.label,
      value,
    };
  });

  return (
    <div className="col-span-12 grid gap-8">
      <div className="flex justify-end">
        <Button type="button" onClick={() => refetch()}>
          <RefreshCcw size={18} />
          {isFetching ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-sm text-(--text-secondary)">Éléments du parc</p>
          <p className="mt-1 text-3xl font-semibold text-(--text-primary)">
            Vue synthétique des assets GLPI
          </p>
        </div>
        <InventorySummaryGrid items={inventoryItems} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm text-(--text-secondary)">Tickets</p>
          <p className="mt-1 text-3xl font-semibold text-(--text-primary)">
            Vue synthétique de l’activité assistance
          </p>
        </div>
        <InventorySummaryGrid items={ticketItems} />
      </section>
    </div>
  );
}
