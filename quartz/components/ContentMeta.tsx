import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"

export default (() => {
  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    if (text) {
      const segments: string[] = []
      const { text: timeTaken, words: _words } = readingTime(text)

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!))
      }

      if (fileData.frontmatter?.authors) {
        segments.push(`Written by ${fileData.frontmatter.authors.join(", ")}`)
      }

      segments.push(timeTaken)
      return <p class={`content-meta ${displayClass ?? ""}`}>{segments.join(", ")}</p>
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    margin-bottom: 25px;
    color: var(--gray);
    font-family: "Caveat", var(--bodyFont);
    font-weight: 400;
    font-size: 28px !important;
    line-height: 1.25 !important;
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
