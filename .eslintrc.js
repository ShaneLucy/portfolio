module.exports = {
  extends: "typescript-airbnb-prettier-svelte",
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      rules: {
        "import/first": "off",
        "import/no-duplicates": "off",
        "import/no-mutable-exports": "off",
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off",
      },
    },
  ],
};
