<section id="about" aria-labelledby="about-heading">
  <div class="container">
    <h2 id="about-heading" class="section-heading">About</h2>
    <div class="about-grid">
      <div class="about-bio">
        <p>
          I'm Shane Lucy, a full-stack developer based in Ireland. I build things that work well and look considered — backends that hold up
          under pressure, and interfaces that don't need explaining.
        </p>
        <p>
          My background spans Java and TypeScript ecosystems, with a particular interest in developer tooling and the moments where
          engineering and design intersect. I care about the details that most people skip.
        </p>
      </div>
      <div class="about-skills">
        <h3 class="skills-heading">Skills</h3>
        <ul role="list" class="skills-list">
          <li class="skill-group">
            <span class="type-label skill-category">Languages</span>
            <span>Java, TypeScript, SQL</span>
          </li>
          <li class="skill-group">
            <span class="type-label skill-category">Frontend</span>
            <span>SvelteKit, CSS, WebGL / GLSL</span>
          </li>
          <li class="skill-group">
            <span class="type-label skill-category">Backend</span>
            <span>Spring Boot, Node.js, PostgreSQL</span>
          </li>
          <li class="skill-group">
            <span class="type-label skill-category">Infrastructure</span>
            <span>Cloudflare, Docker, GitHub Actions</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    display: flex;
    align-items: center;
  }

  .section-heading {
    margin-bottom: var(--space-12);
    font-size: var(--text-2xl);
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    align-items: start;
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: var(--space-12);
    }
  }

  .about-bio {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .about-bio p {
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-size: var(--text-md);
  }

  .skills-heading {
    font-size: var(--text-lg);
    margin-bottom: var(--space-6);
    font-variation-settings: "wght" 600;
  }

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .skill-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid oklch(15% 0.015 270 / 0.6);
  }

  .skill-group:last-child {
    border-bottom: none;
  }

  .skill-category {
    color: var(--cool-bright);
  }

  .skill-group span:last-child {
    color: var(--text-secondary);
  }
</style>
