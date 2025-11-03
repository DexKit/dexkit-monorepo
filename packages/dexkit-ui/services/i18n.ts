/*export default async function getLocaleMessages(
  locale: string | undefined
): Promise<Record<string, string> | null> {
  if (!locale) {
    return null;
  }

  const messageFilePath = path.join(
    process.cwd(),
    "compiled-lang",
    `${locale}.json`
  );

  const messages = await fs.readFile(messageFilePath, "utf8");

  return JSON.parse(messages);
}*/

export default async function getLocaleMessages(
  locale: string | undefined
): Promise<Record<string, string> | null> {
  if (!locale) {
    return null;
  }

  // Use switch statement for static code splitting with Webpack
  switch (locale) {
    case "en-US":
      return (await import("../constants/compiled-lang/en-US.json")).default;
    case "pt-BR":
      return (await import("../constants/compiled-lang/pt-BR.json")).default;
    case "es-ES":
      return (await import("../constants/compiled-lang/es-ES.json")).default;
    case "de-DE":
      return (await import("../constants/compiled-lang/de-DE.json")).default;
    case "nn-NO":
      return (await import("../constants/compiled-lang/nn-NO.json")).default;
    case "fr-FR":
      return (await import("../constants/compiled-lang/fr-FR.json")).default;
    case "it-IT":
      return (await import("../constants/compiled-lang/it-IT.json")).default;
    case "cs-CZ":
      return (await import("../constants/compiled-lang/cs-CZ.json")).default;
    default:
      return (await import("../constants/compiled-lang/en-US.json")).default;
  }
}
