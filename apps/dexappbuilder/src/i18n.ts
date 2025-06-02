import fs from "fs/promises";
import path from "path";

export default async function getLocaleMessages(
  locale: string | undefined,
): Promise<Record<string, string> | null> {
  if (!locale) {
    return null
  }

  const messageFilePath = path.join(
    process.cwd(),
    "compiled-lang",
    `${locale}.json`,
  );

  const messages = await fs.readFile(
    messageFilePath,
    "utf8",
  );

  return JSON.parse(messages);
}