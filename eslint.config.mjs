import next from "eslint-config-next";

const config = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      "**/*.ipynb_checkpoints/**",
      "nn-architectures-project1/solutions.html",
      "nn-architectures-project2/solutions.html",
      "recommendation-system-performance/solution.html"
    ]
  }
];

export default config;
