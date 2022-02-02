<script lang="ts">
  import { Temporal } from "@js-temporal/polyfill";

  import ThemeToggle from "./ThemeToggle.svelte";

  let date = Temporal.Now.zonedDateTimeISO();
  const oneSecond = 1_000;

  function updateTime() {
    date = Temporal.Now.zonedDateTimeISO();

    setTimeout(() => {
      updateTime();
    }, oneSecond);
  }

  updateTime();
</script>

<header>
  <p class="activites">Activities</p>

  <p>
    {date.toLocaleString(navigator.language, {
      day: "numeric",
      month: "short",
    })}
    {date.toLocaleString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
  <div>
    <ThemeToggle />
  </div>
</header>

<style>
  header {
    background-color: var(--background-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    font-size: 0.75rem;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
    padding-left: 0.3rem;
  }

  .activites {
    display: none;
  }

  div {
    padding-right: 0.3rem;
  }

  @media (min-width: 500px) {
    .activites {
      display: block;
    }

    div {
      padding-top: 0.35rem;
      padding-bottom: 0.15rem;
    }
    p {
      font-size: 1rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
</style>
