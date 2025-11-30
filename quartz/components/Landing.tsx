import { QuartzComponentConstructor } from "./types"
import landingStyle from "./styles/landing.scss"

export const TOTAL_CARDS = 6
export const CARDS = {
  "ai-robotics": (
    <a href={"/ai-robotics"}>
      <div class="card card-1">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">AI &<br/>ROBOTICS</p>
            <p class="card-description">Exploring how machines learn, move, and think - from neural circuits to mechanical arms</p>
          </div>
          <div class="card-illustration-area">
            <img src="/static/card-img-1.png" class="card-illustration-1" loading="lazy" decoding="async" />
            <img src="/static/card-img-1-color.png" class="card-illustration-1-color" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="card-issue">VOL. 001</p>
      </div>
    </a>
  ),
  "math-theory": (
    <a href={"/science-theory"}>
      <div class="card card-2">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">SCIENCE<br/>& THEORY</p>
            <p class="card-description">Deep dives into math, physics, biology, computer science and the hidden laws of nature</p>
          </div>
          <div class="card-illustration-area">
            <img src="/static/card-img-2.png" class="card-illustration-2" loading="lazy" decoding="async" />
            <img src="/static/card-img-2-color.png" class="card-illustration-2-color" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="card-issue">VOL. 002</p>
      </div>
    </a>
  ),
  "books-sources": (
    <a href={"/books-sources"}>
      <div class="card card-3">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">BOOKS<br/>& SOURCES</p>
            <p class="card-description">A curated library of texts, references, and rare ideas that shaped this journey</p>
          </div>
          <div class="card-illustration-area">
            <img src="/static/card-img-3.png" class="card-illustration-3" loading="lazy" decoding="async" />
            <img src="/static/card-img-3-color.png" class="card-illustration-3-color" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="card-issue">VOL. 003</p>
      </div>
    </a>
  ),
  "my-opinions": (
    <a href={"/personal-essays"}>
      <div class="card card-4">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">PERSONAL<br/>ESSAYS</p>
            <p class="card-description">Honest reflections, stray thoughts, and the scars</p>
          </div>
          <div class="card-illustration-area">
            <img src="/static/card-img-4.png" class="card-illustration-4" loading="lazy" decoding="async" />
            <img src="/static/card-img-4-color.png" class="card-illustration-4-color" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="card-issue">VOL. 004</p>
      </div>
    </a>
  ),
  "nerdy-things": (
    <a href={"/side-quests"}>
      <div class="card card-5">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">SIDE<br/>QUESTS</p>
            <p class="card-description">Odd obsessions and unfinished dreams</p>
          </div>
          <div class="card-illustration-area">
            <img src="/static/card-img-5.png" class="card-illustration-5" loading="lazy" decoding="async" />
            <img src="/static/card-img-5-color.png" class="card-illustration-5-color" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="card-issue">VOL. 005</p>
      </div>
    </a>
  ),
  "coming-soon": (
    <a href={"/404"}>
      <div class="card card-6">
        <div class="card-content">
          <div class="card-text">
            <p class="card-title">IN<br/>PROGRESS</p>
          </div>
          <div class="card-illustration-area">
            {/* No illustration for coming soon card */}
          </div>
        </div>
        <p class="card-issue">VOL. 006</p>
      </div>
    </a>
  ),
}

export default (() => {
  function LandingComponent() {
    return (
      <div class="landing-page">
        {/* Character anime ở bên trái */}
        
        
        <div class="content-container">
          <p class="landing-header">Welcome to <span class="escaperr-text">escaperr</span>'s space</p>
          <nav class="main-navigation">
            <a href="/" class="nav-link nav-main">HOME</a>
            <span class="nav-separator">•</span>
            <a href="/about/" class="nav-link nav-highlight">ABOUT ME</a>
            <span class="nav-separator">•</span>
            <a href="/projects/" class="nav-link nav-highlight">PROJECTS</a>
            <span class="nav-separator">•</span>
            <a href="/publications/" class="nav-link nav-highlight">PUBLICATIONS</a>
            <span class="nav-separator">•</span>
            <a href="/arts/" class="nav-link nav-highlight">ARTS</a>
          </nav>

          {/* Wrap character and cards together for proper layout */}
          <div class="main-content-wrapper">
            
          <div class="character-container">
            <img src="/static/osamu_landing.png" alt="Osamu Character" class="anime-character" decoding="async" />
          </div>
            
            <div class="issue-container">
              {Object.values(CARDS)}
              {Array(TOTAL_CARDS - Object.keys(CARDS).length)
                .fill(0)
                .map(() => (
                  <div class="card card-coming">
                    <div class="card-content">
                      <div class="card-text">
                        <p class="card-title">Coming Soon</p>
                        <p class="card-description">Lorem ipsum dolor sit amet</p>
                      </div>
                      <div class="card-illustration-area">
                        {/* No illustration for coming soon cards */}
                      </div>
                    </div>
                    <p class="card-issue">VOL. XXX</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* Disclaimer text */}
        <div class="disclaimer-container">
          <p class="disclaimer-text">
            Some media used on this blog are from World Trigger Wiki, this is just for educational, commentary, or fan purposes only. No commercial use intended.
          </p>
        </div>
      </div>
    )
  }

  LandingComponent.css = landingStyle
  return LandingComponent
}) satisfies QuartzComponentConstructor
