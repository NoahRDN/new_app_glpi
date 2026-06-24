# C’est quoi OfficeLayoutShell ?

OfficeLayoutShell est un composant de layout.

Dans ton projet, il sert à construire la structure générale de tes pages :

- sidebar à gauche
- logo
- navigation
- header
- bouton dark/light
- zone principale
- affichage de la page courante avec <Outlet />

Dans ton fichier, il reçoit :

type OfficeLayoutShellProps = {
  actions?: ReactNode;
  navigation: OfficeNavigationItem[];
  officeLabel: string;
  subtitle?: string;
};

Donc ce composant ne représente pas une page précise. Il représente l’enveloppe visuelle autour des pages.

Le <Outlet /> à l’intérieur sert à afficher la page enfant correspondant à la route actuelle .