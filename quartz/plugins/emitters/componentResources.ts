import { FilePath, FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"

// @ts-ignore
import spaRouterScript from "../../components/scripts/spa.inline"
// @ts-ignore
import plausibleScript from "../../components/scripts/plausible.inline"
// @ts-ignore
import popoverScript from "../../components/scripts/popover.inline"
import styles from "../../styles/custom.scss"
import popoverStyle from "../../components/styles/popover.scss"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"
import { QuartzComponent } from "../../components/types"
import { googleFontHref, joinStyles } from "../../util/theme"
import { Features, transform } from "lightningcss"

type ComponentResources = {
  css: string[]
  beforeDOMLoaded: string[]
  afterDOMLoaded: string[]
}

function getComponentResources(ctx: BuildCtx): ComponentResources {
  const allComponents: Set<QuartzComponent> = new Set()
  for (const emitter of ctx.cfg.plugins.emitters) {
    const components = emitter.getQuartzComponents(ctx)
    for (const component of components) {
      allComponents.add(component)
    }
  }

  const componentResources = {
    css: new Set<string>(),
    beforeDOMLoaded: new Set<string>(),
    afterDOMLoaded: new Set<string>(),
  }

  for (const component of allComponents) {
    const { css, beforeDOMLoaded, afterDOMLoaded } = component
    if (css) {
      componentResources.css.add(css)
    }
    if (beforeDOMLoaded) {
      componentResources.beforeDOMLoaded.add(beforeDOMLoaded)
    }
    if (afterDOMLoaded) {
      componentResources.afterDOMLoaded.add(afterDOMLoaded)
    }
  }

  return {
    css: [...componentResources.css],
    beforeDOMLoaded: [...componentResources.beforeDOMLoaded],
    afterDOMLoaded: [...componentResources.afterDOMLoaded],
  }
}

function joinScripts(scripts: string[]): string {
  // wrap with iife to prevent scope collision
  return scripts.map((script) => `(function () {${script}})();`).join("\n")
}

function addGlobalPageResources(
  ctx: BuildCtx,
  staticResources: StaticResources,
  componentResources: ComponentResources,
) {
  const cfg = ctx.cfg.configuration
  const reloadScript = ctx.argv.serve

  // popovers
  if (cfg.enablePopovers) {
    componentResources.afterDOMLoaded.push(popoverScript)
    componentResources.css.push(popoverStyle)
  }

  if (cfg.analytics?.provider === "google") {
    const tagId = cfg.analytics.tagId
    staticResources.js.push({
      src: `https://www.googletagmanager.com/gtag/js?id=${tagId}`,
      contentType: "external",
      loadTime: "afterDOMReady",
    })
    componentResources.afterDOMLoaded.push(`
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag(\`js\`, new Date());
      gtag(\`config\`, \`${tagId}\`, { send_page_view: false });
  
      document.addEventListener(\`nav\`, () => {
        gtag(\`event\`, \`page_view\`, {
          page_title: document.title,
          page_location: location.href,
        });
      });`)
  } else if (cfg.analytics?.provider === "plausible") {
    componentResources.afterDOMLoaded.push(plausibleScript)
  } else if (cfg.analytics?.provider === "umami") {
    componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script")
      umamiScript.src = "https://analytics.umami.is/script.js"
      umamiScript.setAttribute("data-website-id", "${cfg.analytics.websiteId}")
      umamiScript.async = true
  
      document.head.appendChild(umamiScript)
    `)
  }

  if (cfg.enableSPA) {
    componentResources.afterDOMLoaded.push(spaRouterScript)
  } else {
    componentResources.afterDOMLoaded.push(`
        window.spaNavigate = (url, _) => window.location.assign(url)
        const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
        document.dispatchEvent(event)`)
  }

  // Gallery lightbox script for arts page
  componentResources.afterDOMLoaded.push(`
    document.addEventListener("nav", () => {
      if (!document.body.dataset.slug?.startsWith("arts")) return;
      
      function initBentoGallery() {
        const cards = document.querySelectorAll('.bento-card');
        const lightbox = document.getElementById('artLightbox');
        
        if (cards.length === 0 || !lightbox) {
          setTimeout(initBentoGallery, 100);
          return;
        }
        
        cards.forEach(card => {
          if (card.dataset.galleryInit) return;
          card.dataset.galleryInit = 'true';
          
          card.addEventListener('click', (e) => {
            if (e.target.tagName === 'IFRAME') return;
            
            const isVideo = card.dataset.video;
            const imgEl = card.querySelector('img');
            const src = imgEl ? imgEl.src : '';
            const title = card.dataset.title || '';
            const meta = card.dataset.meta || '';
            const desc = card.dataset.desc || '';
            const category = card.dataset.category || '';
            
            const lightboxImg = document.getElementById('lightboxImg');
            const lightboxVideo = document.getElementById('lightboxVideo');
            
            if (isVideo) {
              lightboxImg.style.display = 'none';
              lightboxVideo.style.display = 'block';
              lightboxVideo.src = card.dataset.video + '?autoplay=1';
            } else {
              lightboxImg.style.display = 'block';
              lightboxVideo.style.display = 'none';
              lightboxVideo.src = '';
              lightboxImg.src = src;
            }
            
            document.getElementById('lightboxTag').textContent = category.charAt(0).toUpperCase() + category.slice(1);
            document.getElementById('lightboxTitle').textContent = title;
            document.getElementById('lightboxMeta').textContent = meta;
            document.getElementById('lightboxDesc').textContent = desc;
            document.getElementById('artLightbox').classList.add('active');
            document.body.style.overflow = 'hidden';
          });
        });

        lightbox.onclick = (e) => {
          if (e.target.id === 'artLightbox' || e.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            const video = document.getElementById('lightboxVideo');
            if (video) video.src = '';
            document.body.style.overflow = '';
          }
        };
      }

      initBentoGallery();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const lightbox = document.getElementById('artLightbox');
        if (lightbox) {
          lightbox.classList.remove('active');
          const video = document.getElementById('lightboxVideo');
          if (video) video.src = '';
          document.body.style.overflow = '';
        }
      }
    });
  `)

  let wsUrl = `ws://localhost:${ctx.argv.wsPort}`

  if (ctx.argv.remoteDevHost) {
    wsUrl = `wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`
  }

  if (reloadScript) {
    staticResources.js.push({
      loadTime: "afterDOMReady",
      contentType: "inline",
      script: `
          const socket = new WebSocket('${wsUrl}')
          socket.addEventListener('message', () => document.location.reload())
        `,
    })
  }
}

interface Options {
  fontOrigin: "googleFonts" | "local"
}

const defaultOptions: Options = {
  fontOrigin: "googleFonts",
}

export const ComponentResources: QuartzEmitterPlugin<Options> = (opts?: Partial<Options>) => {
  const { fontOrigin } = { ...defaultOptions, ...opts }
  return {
    name: "ComponentResources",
    getQuartzComponents() {
      return []
    },
    async emit(ctx, _content, resources, emit): Promise<FilePath[]> {
      // component specific scripts and styles
      const componentResources = getComponentResources(ctx)
      // important that this goes *after* component scripts
      // as the "nav" event gets triggered here and we should make sure
      // that everyone else had the chance to register a listener for it

      if (fontOrigin === "googleFonts") {
        resources.css.push(googleFontHref(ctx.cfg.configuration.theme))
      } else if (fontOrigin === "local") {
        // let the user do it themselves in css
      }

      addGlobalPageResources(ctx, resources, componentResources)

      const stylesheet = joinStyles(ctx.cfg.configuration.theme, ...componentResources.css, styles)
      const prescript = joinScripts(componentResources.beforeDOMLoaded)
      const postscript = joinScripts(componentResources.afterDOMLoaded)
      const fps = await Promise.all([
        emit({
          slug: "index" as FullSlug,
          ext: ".css",
          content: transform({
            filename: "index.css",
            code: Buffer.from(stylesheet),
            minify: true,
            targets: {
              safari: (15 << 16) | (6 << 8), // 15.6
              ios_saf: (15 << 16) | (6 << 8), // 15.6
              edge: 115 << 16,
              firefox: 102 << 16,
              chrome: 109 << 16,
            },
            include: Features.MediaQueries,
          }).code.toString(),
        }),
        emit({
          slug: "prescript" as FullSlug,
          ext: ".js",
          content: prescript,
        }),
        emit({
          slug: "postscript" as FullSlug,
          ext: ".js",
          content: postscript,
        }),
      ])
      return fps
    },
  }
}
