import { useEffect } from "react";
import { getTicketAssetLinks } from "../../entities/ticket/api/ticketItem.api";

export function LegacyApiTest() {
  useEffect(() => {
    async function test() {
      const links = await getTicketAssetLinks();
      console.log("Ticket asset links:", links);
    }

    test();
  }, []);

  return <div>Test legacy API</div>;
}