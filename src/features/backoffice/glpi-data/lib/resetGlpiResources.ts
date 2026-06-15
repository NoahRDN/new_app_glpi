import {
  DEFAULT_RESET_FORCE_DELETE,
  deleteGlpiResourceItem,
  getGlpiResourceItems,
} from "../api/glpiDataResource.api";
import { getGlpiDataResource, type GlpiDataResourceId } from "../model/glpiDataResource.config";
import type { GlpiResetResult, GlpiResetResourceResult } from "../model/glpiDataReset.types";
import { getAllTickets } from "../../../../entities/ticket/api/ticket.api";
import { ticketFilterDefault } from "../../../../entities/ticket/model/ticket.config";
import { deleteTicketItemLink, getTicketItemLinks } from "../../../../entities/ticket/api/ticketItem.api";
import { deleteTicketCost, getTicketCosts } from "../../../../entities/ticket-cost/api/ticketCost.api";
import { deleteTicketFollowup, getTicketFollowups } from "../../../../entities/ticket/api/ticketFollowup.api";
import { deleteTicketSolution, getTicketSolutions } from "../../../../entities/ticket/api/ticketSolution.api";
import { deleteAllSuperCost1, getSuperCosts1 } from "../../../frontoffice/super-cost1/api/superCost1.api";

export async function resetGlpiResources(params: {
  forceDelete?: boolean;
  resourceIds: GlpiDataResourceId[];
}): Promise<GlpiResetResult> {
  const forceDelete = params.forceDelete ?? DEFAULT_RESET_FORCE_DELETE;
  const results: GlpiResetResourceResult[] = [];

  async function resetSpecialResource(resourceId: GlpiDataResourceId) {
    const errors: GlpiResetResourceResult["errors"] = [];
    let deletedCount = 0;
    let totalFound = 0;

    try {
      if (resourceId === "ticketLinks") {
        const links = await getTicketItemLinks();
        totalFound = links.length;

        for (const link of links) {
          try {
            await deleteTicketItemLink(link.id);
            deletedCount += 1;
          } catch (caughtError) {
            errors.push({
              id: link.id,
              message: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });
          }
        }
      } else if (resourceId === "superCost") {
        const superCosts = await getSuperCosts1();
        totalFound = superCosts.length;

        for (const superCost of superCosts) {
          try {
            // await deleteSuperCost1(superCost.id);
            await deleteAllSuperCost1()
            deletedCount += 1;
          } catch (caughtError) {
            errors.push({
              id: superCost.id,
              message: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });
          }
        }
      } else if (resourceId === "ticketCosts") {
        const costs = await getTicketCosts();
        totalFound = costs.length;

        for (const cost of costs) {
          try {
            await deleteTicketCost(cost.id);
            deletedCount += 1;
          } catch (caughtError) {
            errors.push({
              id: cost.id,
              message: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });
          }
        }
      } else if (resourceId === "ticketFollowups" || resourceId === "ticketSolutions") {
        const tickets = await getAllTickets(ticketFilterDefault);
        const subitems: Array<{ id: number; ticketId: number }> = [];

        for (const ticket of tickets) {
          if (resourceId === "ticketFollowups") {
            const followups = await getTicketFollowups(ticket.id);
            subitems.push(
              ...followups.map((followup) => ({
                id: followup.id,
                ticketId: ticket.id,
              })),
            );
          } else {
            const solutions = await getTicketSolutions(ticket.id);
            subitems.push(
              ...solutions.map((solution) => ({
                id: solution.id,
                ticketId: ticket.id,
              })),
            );
          }
        }

        totalFound = subitems.length;

        for (const subitem of subitems) {
          try {
            if (resourceId === "ticketFollowups") {
              await deleteTicketFollowup(subitem.ticketId, subitem.id);
            } else {
              await deleteTicketSolution(subitem.ticketId, subitem.id);
            }

            deletedCount += 1;
          } catch (caughtError) {
            errors.push({
              id: subitem.id,
              message: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });
          }
        }
      }
    } catch (caughtError) {
      errors.push({
        id: "resource",
        message: caughtError instanceof Error ? caughtError.message : String(caughtError),
      });
    }

    return {
      deletedCount,
      errors,
      failedCount: errors.length,
      resourceId,
      totalFound,
    };
  }

  for (const resourceId of params.resourceIds) {
    if (
      resourceId === "ticketLinks" ||
      resourceId === "ticketCosts" ||
      resourceId === "ticketFollowups" ||
      resourceId === "ticketSolutions" ||
      resourceId === "superCost"
    ) {
      results.push(await resetSpecialResource(resourceId));
      continue;
    }

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
