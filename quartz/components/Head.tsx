import { FullSlug, _stripSlashes, joinSegments, pathToRoot } from "../util/path"
import { JSResourceToScriptElement } from "../util/resources"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function Head({ cfg, fileData, externalResources }: QuartzComponentProps) {
    const title = fileData.frontmatter?.title 
  ? `${fileData.frontmatter.title} | ${cfg.pageTitle}`
  : cfg.pageTitle ?? "Untitled"
    const description = fileData.description?.trim() ?? "No description provided"
    const { css, js } = externalResources
    const siteUrl = `https://${cfg.baseUrl ?? "example.com"}`
    const url = new URL(siteUrl)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)

    const iconPath = joinSegments(baseDir, "static/icon.png")
    const ogImagePath = cfg.baseUrl
      ? `https://${cfg.baseUrl}/static/preview-bg.png`
      : undefined

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {cfg.baseUrl && ogImagePath && <meta property="og:image" content={ogImagePath} />}
        {cfg.baseUrl && ogImagePath && <meta name="twitter:card" content="summary_large_image" />}
        {cfg.baseUrl && ogImagePath && <meta name="twitter:image" content={ogImagePath} />}        
        <meta property="og:width" content="1200" />
        <meta property="og:height" content="675" />
        <link rel="icon" href={iconPath} />
        {cfg.baseUrl && (
          <link
            rel="canonical"
            href={`${siteUrl}/${fileData.slug === "index" ? "" : fileData.slug}`}
          />
        )}
        {cfg.baseUrl && (
          <link rel="alternate" type="application/rss+xml" title={cfg.pageTitle}
            href={`${siteUrl}/index.xml`} />
        )}
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Caveat:wght@400&display=swap" rel="stylesheet" />
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
