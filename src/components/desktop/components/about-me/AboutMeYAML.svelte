<script lang="ts">
  import YAML from "./AboutMeYAML.md";
</script>

<div>
  <div>
    <YAML />
  </div>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    background-color: var(--background-tertiary);
  }

  div div {
    width: calc(100% - 1.5rem);
    height: calc(100% - 1.5rem);
    margin: 0.75rem;
  }
</style>
