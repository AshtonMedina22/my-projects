# Recommendation System Performance

Portfolio-ready analysis of three e-commerce recommendation model versions:

- `v1.0` - baseline model, cheapest to run
- `v1.1` - improved model, moderate cost
- `v2.0` - latest model, highest inference cost

The project evaluates conversion lift, profit, AI-specific ROI, overall business ROI, customer segment performance, and fairness indicators across region and age.

## Files

- `ecommerce_recommendation_events.csv` - synthetic 10-month e-commerce event dataset.
- `notebook.ipynb` - starter Codecademy notebook.
- `solution.ipynb`, `solution.html`, `solution.md` - completed course solution exports.
- `analyze_recommendations.py` - runnable Python analysis script.
- `RESULTS.md` - executive summary and deployment recommendation.
- `index.html` - portfolio detail page.

## Run

```bash
python analyze_recommendations.py
```

## Recommendation

Use a smart routing strategy rather than deploying one model globally. `v1.1` is the cleanest default because it has strong conversion, improved profit, and no statistically significant region or age bias in the final summary. Use segment-specific routing where ROI supports it, and continue improving `v2.0` before broad rollout because it shows age-bias risk despite strong total profit.

