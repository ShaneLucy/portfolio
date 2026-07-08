<section id="contact" aria-labelledby="contact-heading">
  <div class="container contact-inner">
    <h2 id="contact-heading" class="section-heading">Get in touch</h2>
    <p class="contact-lead">Open to interesting problems. Let's talk.</p>
    <ul class="contact-links" role="list">
      <li>
        <a href="mailto:shanelucy01@protonmail.com" class="contact-link type-label"> Email ↗ </a>
      </li>
      <li>
        <a href="https://github.com/shanelucy" class="contact-link type-label" target="_blank" rel="noopener noreferrer"> GitHub ↗ </a>
      </li>
    </ul>
  </div>
</section>

<style>
  section {
    display: flex;
    align-items: center;
    min-height: 60svh;
  }

  .contact-inner {
    max-width: 48rem;
  }

  .section-heading {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-6);
  }

  .contact-lead {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--space-12);
    line-height: var(--leading-snug);
  }

  .contact-links {
    display: flex;
    gap: var(--space-8);
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
  }

  .contact-link {
    display: inline-block;
    color: var(--text-primary);
    text-decoration: none;
    border-bottom: 1px solid oklch(30% 0.02 270deg);
    padding-bottom: var(--space-1);
    transition:
      border-color var(--transition-fast),
      color var(--transition-fast);
  }

  .contact-link:hover {
    border-color: var(--cool-bright);
    color: var(--cool-bright);
  }
</style>
