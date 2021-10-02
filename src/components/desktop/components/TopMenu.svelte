<script lang="ts">
  let date = new Date();

  const i = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
  function updateTime() {
    date = new Date();
    setTimeout(() => {
      updateTime();
    }, 1_000);
  }

  updateTime();
</script>

<header>
  <div class="start">
    <p>Activities</p>
  </div>
  <div>
    {i}
    <p>
      {date.toLocaleString(navigator.language, {
        day: 'numeric',
        month: 'short'
      })}
      {date.toLocaleString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </p>
  </div>
  <div class="end">
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
      /></svg
    >
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      /></svg
    >
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      fill="currentColor"
      enable-background="new 0 0 512 512"
      stroke="currentColor"
    >
      <g>
        <g>
          <path
            d="m256,501c-120.6,0-218.7-98.1-218.7-218.7 0-91.6 57.9-174.1 144.2-205.4 10.6-3.9 22.3,1.6 26.2,12.2 3.8,10.6-1.6,22.3-12.2,26.2-70.1,25.5-117.3,92.6-117.3,167 0,98.1 79.8,177.8 177.8,177.8 98.1,0 177.8-79.8 177.8-177.8 0-74.4-47.1-141.6-117.3-167-10.6-3.8-16.1-15.6-12.2-26.2 3.8-10.6 15.6-16.1 26.2-12.2 86.2,31.3 144.2,113.8 144.2,205.4 0,120.6-98.1,218.7-218.7,218.7z"
          />
          <path
            d="m256,308.8c-11.3,0-20.4-9.1-20.4-20.4v-257c0-11.3 9.1-20.4 20.4-20.4 11.3,0 20.4,9.1 20.4,20.4v256.9c0,11.3-9.1,20.5-20.4,20.5z"
          />
        </g>
      </g>
    </svg>
  </div>
</header>

<style>
  header {
    background-color: var(--background-secondary);
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  div {
    display: flex;
    padding-top: 0.35rem;
    padding-bottom: 0.15rem;
    padding-left: 2rem;
    padding-right: 2rem;
    border-bottom: 0.2rem solid var(--background-secondary);
  }

  div:hover {
    border-bottom: 0.2rem solid var(--secondary);
  }

  .start {
    justify-content: space-between;
    margin-left: 1rem;
  }

  .end {
    column-gap: 0.8rem;
    margin-right: 1rem;
  }

  svg {
    height: 1.25rem;
    width: auto;
  }
</style>
