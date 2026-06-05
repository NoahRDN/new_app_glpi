import { Card } from "../../shared/ui/Card";

export function AccountPage() {
  return (
    <>
      <Card
        className="col-span-12 xl:col-span-6"
        description="Résumé du compte frontoffice et des accès visibles pour l’utilisateur."
        title="Mon espace"
      >
        <div className="space-y-4 text-sm text-(--text-secondary)">
          <p>Session frontoffice distincte de l’administration.</p>
          <p>Le design reprend maintenant le même shell que le backoffice : sidebar, topbar et zones de contenu.</p>
        </div>
      </Card>

      <Card
        className="col-span-12 xl:col-span-6"
        description="Bloc prêt à être connecté plus tard aux informations GLPI réelles."
        title="Permissions visibles"
      >
        <div className="space-y-3 text-sm text-(--text-secondary)">
          <p>Consultation des tickets</p>
          <p>Consultation du centre d’aide</p>
          <p>Accès au portail utilisateur</p>
        </div>
      </Card>
    </>
  );
}
