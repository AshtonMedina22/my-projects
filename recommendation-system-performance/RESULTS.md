# Recommendation System Performance Results

## Dataset

- Events: 50,000
- Purchases: 3,225
- Overall conversion rate: 6.45%
- Total revenue from conversions: $580,316.66
- Total product cost from conversions: $273,011.92
- Total inference cost across all events: $106.65
- Total profit: $307,294.67
- Average profit per conversion: $95.29

## Recommendation Lift

Recommended products materially outperformed non-recommended products:

- Conversion lift: 2.45x
- Profit lift: 2.84x

## Model Version Comparison

| Model | Conversion Rate | Total Profit | AI ROI | Overall ROI | Bias Flag |
| --- | ---: | ---: | ---: | ---: | --- |
| v1.0 | 6.05% | $83,152.93 | 405,110.27% | 110.75% | Yes |
| v1.1 | 6.67% | $95,906.73 | 320,073.17% | 112.74% | No |
| v2.0 | 6.58% | $128,138.43 | 228,166.72% | 113.43% | Yes |

## Fairness Findings

- Overall region recommendation behavior is statistically significant: p < 0.05.
- Overall age recommendation behavior is statistically significant: p < 0.05.
- `v2.0` improves regional fairness versus `v1.0`.
- `v2.0` worsens age fairness versus `v1.0`.
- `v1.1` is the only model in the final summary without significant region or age bias.

## Segment Findings

Profit contribution by customer segment:

- Regular: $148,859.51, 48.44%
- Premium: $84,071.95, 27.36%
- Budget: $74,363.22, 24.20%

Best ROI by customer segment:

- Budget: `v1.1`
- Premium: `v1.0`
- Regular: `v1.0`

## Executive Recommendation

Do not deploy `v2.0` globally yet. It produces the highest total profit and best overall ROI, but the significant age-bias result makes it risky for a broad rollout without remediation and monitoring.

Use `v1.1` as the default production model because it has the strongest conversion rate, solid ROI, and no significant bias indicators in the final model summary. For a more cost-efficient strategy, route budget customers to `v1.1`, premium and regular customers to `v1.0`, and reserve `v2.0` for limited experiments after age-bias mitigation.

