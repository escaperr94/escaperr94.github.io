import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  const topLevelFolder = (fileData.slug ?? "").split("/")[0]
  const folderToImage: Record<string, string> = {
    "ai-robotics": "/static/ct-1.jpg",
    "science-theory": "/static/ct-2.jpg",
    "books-sources": "/static/ct-3.jpg",
    "personal-essays": "/static/ct-4.jpg",
    "side-quests": "/static/ct-5.jpg",
  }
  const headerImage = folderToImage[topLevelFolder]
  return (
    <h1 class={`page-title ${displayClass ?? ""}`}>
      <a href={baseDir}>{title}</a>
      {headerImage && <img class="header-thumb" src={headerImage} alt="section thumbnail" />}
    </h1>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
}
.page-title .header-thumb {
  display: block;
  width: 162px;
  height: auto;
  margin-top: 18px;
  margin-bottom: 8px;
  border-radius: 8px;
}
@media (max-width: 900px) {
  .page-title .header-thumb { display: none !important; }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
