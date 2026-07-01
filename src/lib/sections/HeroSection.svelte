<section id="hero" aria-labelledby="hero-heading">
  <div class="container hero-inner">
    <div class="hero-content">
      <h1 id="hero-heading" class="type-display hero-headline">
        Shane Lucy
      </h1>
      <p class="hero-subtext">
        Full-stack developer. Interfaces that earn a second look.
      </p>
      <a href="#projects" class="hero-cta type-label" aria-label="View my projects">
        See the work ↓
      </a>
    </div>
  </div>
  <div class="scroll-indicator parallax-layer-1" aria-hidden="true">
    <span class="scroll-line"></span>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: calc(var(--section-padding-y) + 4rem);
    padding-bottom: var(--section-padding-y);
  }

  .hero-inner {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .hero-content {
    max-width: 70rem;
  }

  .hero-headline {
    margin-bottom: var(--space-6);
    color: var(--text-primary);
  }

  .hero-subtext {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    line-height: var(--leading-snug);
    margin-bottom: var(--space-12);
    max-width: 40ch;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--cool-bright);
    text-decoration: none;
    border-bottom: 1px solid var(--cool-bright);
    padding-bottom: var(--space-1);
    transition: color var(--transition-fast), border-color var(--transition-fast);
  }

  .hero-cta:hover {
    color: var(--cool-accent);
    border-color: var(--cool-accent);
  }

  .scroll-indicator {
    display: flex;
    justify-content: center;
    padding-bottom: var(--space-8);
    margin-top: auto;
  }

  .scroll-line {
    display: block;
    width: 1px;
    height: 3rem;
    background: linear-gradient(to bottom, var(--text-tertiary), transparent);
  }

  @media (prefers-reduced-motion: no-preference) {
    .scroll-line {
      animation: scroll-drip 2.4s ease-in-out infinite;
    }
  }

  @keyframes scroll-drip {
    0%   { opacity: 0.3; transform: scaleY(0.6) translateY(-20%); }
    50%  { opacity: 1;   transform: scaleY(1)   translateY(0); }
    100% { opacity: 0.3; transform: scaleY(0.6) translateY(20%); }
  }
</style>
