import { readFileSync, writeFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = dirname(__filename);

export const TEXT_FILE_PATH = join(__dirname, "text.txt")

export const loadInitialText = (): string => {
  try {
    if (existsSync(TEXT_FILE_PATH)) {
      return readFileSync(TEXT_FILE_PATH, "utf8")
    } else {
      writeFileSync(TEXT_FILE_PATH, "", "utf8")
      return ""
    }
  } catch (err) {
    console.error("Error reading/writing file:", err)
    return ""
  }
}

export const saveTextToFile = (text: string): void => {
  try {
    writeFileSync(TEXT_FILE_PATH, text, "utf8")
    console.log("Saved text to file:", text)
  } catch (err) {
    console.error("Error saving text to file:", err)
  }
}