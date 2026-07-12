<header class="nav-header">
  <nav aria-label="Main navigation">
    <div class="container nav-inner">
      <a href="#hero" class="nav-brand type-label" aria-label="Shane Lucy — back to top">SL</a>
      <ul class="nav-links" role="list">
        <li class="nav-link-home"><a href="#hero" class="nav-link type-label">Home</a></li>
        <li><a href="#projects" class="nav-link type-label">Projects</a></li>
        <li><a href="#about" class="nav-link type-label">About</a></li>
        <li><a href="#contact" class="nav-link type-label">Contact</a></li>
      </ul>
    </div>
  </nav>
</header>

<style>
  .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: color-mix(in oklch, var(--surface-base) 85%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid color-mix(in oklch, var(--surface-raised) 60%, transparent);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
  }

  .nav-brand {
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: var(--tracking-wide);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  @media (width <= 640px) {
    .nav-links {
      gap: var(--space-4);
    }
  }

  /* At 400% zoom / 320px viewport the brand already serves as Home */
  @media (width <= 400px) {
    .nav-links {
      gap: var(--space-3);
    }

    .nav-link-home {
      display: none;
    }
  }
</style>
