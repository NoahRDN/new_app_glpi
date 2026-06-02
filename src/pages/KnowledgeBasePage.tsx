import { Card } from "../shared/ui/Card";

const articles = [
  {
    title: "Procedure de prise en charge",
    text: "Definir le triage initial, les priorites et les escalades support.",
  },
  {
    title: "Inventaire et affectation",
    text: "Documenter la livraison, le retour et le cycle de vie des materiels.",
  },
  {
    title: "Base de solutions",
    text: "Centraliser les resolutions recurrentes pour reduire le temps moyen de traitement.",
  },
];

export function KnowledgeBasePage() {
  return (
    <>
      {articles.map((article) => (
        <Card key={article.title} title={article.title} description={article.text}>
          <p className="text-sm leading-6 text-slate-500">
            Cette zone pourra accueillir les contenus synchronises avec la base de
            connaissances GLPI ou des contenus internes.
          </p>
        </Card>
      ))}
    </>
  );
}
