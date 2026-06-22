Cette ligne :

const rawBlob = await entry.async("blob");

veut dire :

“Lis le fichier du ZIP sous forme de Blob.”

Mais un Blob peut être :

image/png
text/csv
application/json
text/plain
application/pdf
application/octet-stream

Donc non, le Blob n’est pas limité aux images.

Dans ton cas, c’est une image parce que tu es dans une fonction qui a déjà filtré les entrées ZIP avec :

const SUPPORTED_IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;

Donc le code lit des fichiers images, mais techniquement entry.async("blob") peut lire n’importe quel fichier du ZIP.

5. Les autres formats possibles avec entry.async(...)

Avec JSZip, tu peux lire une entrée ZIP sous plusieurs formes.

Les plus utiles pour toi :

await entry.async("blob")

Pour obtenir un Blob. Très utile si tu veux reconstruire un File.

Exemple : image, CSV à repasser à un parser, PDF à uploader.

await entry.async("text")

Pour obtenir directement le contenu texte.

Exemple : CSV, JSON, TXT, XML.

await entry.async("arraybuffer")

Pour obtenir les données binaires brutes.

Utile si tu dois analyser les octets toi-même.

await entry.async("base64")

Pour obtenir le fichier encodé en base64.

Utile si une API attend du base64.

await entry.async("uint8array")

Pour obtenir les octets sous forme de Uint8Array.

Utile pour analyse binaire avancée.

6. Quand utiliser blob ou text ?

Règle simple :

Tu veux recréer un fichier ? → blob puis new File(...)
Tu veux lire le contenu texte ? → text
Tu veux analyser les octets ? → arraybuffer ou uint8array

Donc pour ton cas :

Image à importer → blob
CSV à envoyer à parseCsvRaw(file) → blob puis new File(...)
CSV à lire manuellement → text
JSON à lire directement → text puis JSON.parse(...)
TXT à lire directement → text
7. Pour un CSV dans un ZIP

Si ton parser actuel attend un File, tu fais comme ceci :

export async function extractCsvFilesFromZip(file: File): Promise<File[]> {
  const zip = await loadZip(file);
  const csvEntries = getCsvZipEntries(zip);

  return Promise.all(
    csvEntries.map(async (entry) => {
      const fileName = getZipEntryFileName(entry.name);
      const blob = await entry.async("blob");

      return new File([blob], fileName, {
        type: "text/csv",
      });
    }),
  );
}

Ici, tu utilises blob parce que tu veux reconstruire un vrai fichier CSV :

File("assets.csv")
File("tickets.csv")
File("scenario.csv")

Ensuite, tu peux envoyer ces fichiers dans ton pipeline existant :

const rawFile = await parseCsvRaw(csvFile);
8. Pour un JSON dans un ZIP

Si tu veux lire directement le contenu JSON :

const text = await entry.async("text");
const data = JSON.parse(text);

Exemple complet :

const SUPPORTED_JSON_EXTENSIONS = /\.json$/i;

function getJsonZipEntries(zip: JSZip) {
  return Object.values(zip.files).filter(
    (entry) =>
      !entry.dir &&
      !isIgnoredZipEntry(entry.name) &&
      SUPPORTED_JSON_EXTENSIONS.test(entry.name),
  );
}

export async function extractJsonFilesFromZip(file: File) {
  const zip = await loadZip(file);
  const jsonEntries = getJsonZipEntries(zip);

  return Promise.all(
    jsonEntries.map(async (entry) => {
      const fileName = getZipEntryFileName(entry.name);
      const text = await entry.async("text");
      const data = JSON.parse(text);

      return {
        fileName,
        data,
      };
    }),
  );
}

Si le ZIP contient :

config.json

avec :

{
  "project": "GLPI",
  "version": 1
}

La fonction retourne :

[
  {
    fileName: "config.json",
    data: {
      project: "GLPI",
      version: 1
    }
  }
]
9. Pour un fichier texte .txt

Là, pas besoin de JSON.parse.

Tu lis simplement avec :

const content = await entry.async("text");

Exemple complet :

const SUPPORTED_TEXT_EXTENSIONS = /\.txt$/i;

function getTextZipEntries(zip: JSZip) {
  return Object.values(zip.files).filter(
    (entry) =>
      !entry.dir &&
      !isIgnoredZipEntry(entry.name) &&
      SUPPORTED_TEXT_EXTENSIONS.test(entry.name),
  );
}

export async function extractTextFilesFromZip(file: File) {
  const zip = await loadZip(file);
  const textEntries = getTextZipEntries(zip);

  return Promise.all(
    textEntries.map(async (entry) => {
      const fileName = getZipEntryFileName(entry.name);
      const content = await entry.async("text");

      return {
        fileName,
        content,
      };
    }),
  );
}

Si le ZIP contient :

readme.txt

avec :

Bonjour, ceci est un fichier texte.

La fonction retourne :

[
  {
    fileName: "readme.txt",
    content: "Bonjour, ceci est un fichier texte."
  }
]
10. Pour un JSON mais comme vrai File

Parfois, tu ne veux pas lire le JSON directement. Tu veux juste recréer un fichier pour l’envoyer ailleurs.

Dans ce cas, comme pour CSV, tu utilises blob :

export async function extractJsonFilesAsFilesFromZip(file: File): Promise<File[]> {
  const zip = await loadZip(file);
  const jsonEntries = getJsonZipEntries(zip);

  return Promise.all(
    jsonEntries.map(async (entry) => {
      const fileName = getZipEntryFileName(entry.name);
      const blob = await entry.async("blob");

      return new File([blob], fileName, {
        type: "application/json",
      });
    }),
  );
}

Donc :

Si tu veux lire le JSON → entry.async("text")
Si tu veux refaire un fichier JSON → entry.async("blob") + new File(...)