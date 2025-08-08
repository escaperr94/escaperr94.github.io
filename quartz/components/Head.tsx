import { FullSlug, _stripSlashes, joinSegments, pathToRoot } from "../util/path"
import { getDate } from "./Date"
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

    const isHome = fileData.slug === "index"
    const pageUrl = cfg.baseUrl
      ? `https://${cfg.baseUrl}/${isHome ? "" : fileData.slug}`
      : undefined
    const ogType = isHome ? "website" : "article"

    const published = fileData.dates?.published ?? fileData.dates?.created
    const modified = fileData.dates?.modified ?? published
    const authors = fileData.frontmatter?.authors ?? undefined
    const tags: string[] | undefined = fileData.frontmatter?.tags
    const langCode = (fileData.frontmatter?.lang ?? "en").toLowerCase()
    const ogLocale = langCode.startsWith("vi") ? "vi_VN" : "en_US"

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:locale" content={ogLocale} />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        {cfg.baseUrl && ogImagePath && <meta property="og:image" content={ogImagePath} />}
        {cfg.baseUrl && ogImagePath && <meta property="og:image:width" content="1200" />}
        {cfg.baseUrl && ogImagePath && <meta property="og:image:height" content="675" />}
        {cfg.baseUrl && ogImagePath && <meta property="og:image:alt" content={title} />}
        {cfg.baseUrl && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImagePath && <meta name="twitter:image" content={ogImagePath} />}
          </>
        )}
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
        {authors && <meta name="author" content={authors.join(", ")} />}
        {tags && tags.map((tag) => (
          <meta property="article:tag" content={tag} />
        ))}
        {fileData.slug === "404" && <meta name="robots" content="noindex, nofollow" />}
        {!isHome && published && (
          <>
            <meta property="article:published_time" content={new Date(published).toISOString()} />
            {modified && (
              <meta property="article:modified_time" content={new Date(modified).toISOString()} />
            )}
          </>
        )}
        <meta name="generator" content="Quartz" />
        {/* Preload background images to speed up first paint */}
        {isHome && (
          <link rel="preload" as="image" href="/static/bg-new.png" type="image/png" />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Caveat:wght@400&display=swap" rel="stylesheet" />
        {/* JSON-LD: WebSite (home) */}
        {isHome && cfg.baseUrl && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: siteUrl,
              name: cfg.pageTitle,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            })}
          </script>
        )}
        {/* JSON-LD: Article (content pages) */}
        {!isHome && cfg.baseUrl && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: fileData.frontmatter?.title ?? cfg.pageTitle,
              description,
              datePublished: published ? new Date(published).toISOString() : undefined,
              dateModified: modified ? new Date(modified).toISOString() : undefined,
              author: authors?.map((name: string) => ({ '@type': 'Person', name })) ?? undefined,
              image: ogImagePath,
              url: pageUrl,
            })}
          </script>
        )}
        {/* JSON-LD: BreadcrumbList */}
        {!isHome && cfg.baseUrl && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: (
                (() => {
                  const parts = (fileData.slug ?? '').split('/').filter(Boolean)
                  const items = [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                  ] as any[]
                  if (parts.length > 1) {
                    const folder = parts[0]
                    items.push({
                      '@type': 'ListItem',
                      position: 2,
                      name: folder,
                      item: `${siteUrl}/${folder}`,
                    })
                    items.push({
                      '@type': 'ListItem',
                      position: 3,
                      name: fileData.frontmatter?.title ?? parts[parts.length - 1],
                      item: pageUrl,
                    })
                  } else if (parts.length === 1) {
                    items.push({
                      '@type': 'ListItem',
                      position: 2,
                      name: fileData.frontmatter?.title ?? parts[0],
                      item: pageUrl,
                    })
                  }
                  return items
                })()
              ),
            })}
          </script>
        )}
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
