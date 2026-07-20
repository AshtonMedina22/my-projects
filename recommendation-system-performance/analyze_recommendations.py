import pandas as pd
from pathlib import Path
from scipy.stats import chi2_contingency


def money(value):
    return f"${value:,.2f}"


def main():
    project_dir = Path(__file__).resolve().parent
    events = pd.read_csv(project_dir / "ecommerce_recommendation_events.csv")
    events["converted"] = events["event_type"] == "purchase"

    total_revenue = events[events["converted"]]["revenue"].sum()
    total_product_cost = events[events["converted"]]["product_cost"].sum()
    total_inference_cost = events["inference_cost"].sum()
    total_cost = events[events["converted"]]["total_cost"].sum()
    total_profit = events[events["converted"]]["profit"].sum()
    avg_profit_per_conversion = total_profit / events["converted"].sum()

    rec_analysis = events.groupby("recommended").agg({
        "converted": "mean",
        "profit": "mean",
    }).reset_index()
    rec_analysis.columns = ["recommended", "conversion_rate", "avg_profit"]

    conv_lift = (
        rec_analysis[rec_analysis["recommended"] == 1]["conversion_rate"].values[0]
        / rec_analysis[rec_analysis["recommended"] == 0]["conversion_rate"].values[0]
    )
    profit_lift = (
        rec_analysis[rec_analysis["recommended"] == 1]["avg_profit"].values[0]
        / rec_analysis[rec_analysis["recommended"] == 0]["avg_profit"].values[0]
    )

    version_performance = events.groupby("model_version").agg({
        "event_type": "count",
        "converted": "mean",
        "revenue": "sum",
        "inference_cost": "sum",
        "product_cost": "sum",
        "profit": "sum",
    }).reset_index()
    version_performance.columns = [
        "model_version",
        "num_events",
        "conversion_rate",
        "total_revenue",
        "total_inference_cost",
        "total_product_cost",
        "total_profit",
    ]
    version_performance["ai_roi_percentage"] = (
        version_performance["total_profit"] / version_performance["total_inference_cost"]
    ) * 100
    total_costs = version_performance["total_inference_cost"] + version_performance["total_product_cost"]
    version_performance["overall_roi_percentage"] = (
        version_performance["total_profit"] / total_costs
    ) * 100

    overall_rec_rate = events["recommended"].mean()
    region_rec_rate = events.groupby("region")["recommended"].mean().reset_index()
    region_rec_rate.columns = ["region", "recommendation_rate"]
    region_rec_rate["diff_from_avg"] = region_rec_rate["recommendation_rate"] - overall_rec_rate
    region_rec_rate["potential_bias"] = abs(region_rec_rate["diff_from_avg"]) > 0.10

    region_contingency = pd.crosstab(events["region"], events["recommended"])
    chi2_region, p_region, _, _ = chi2_contingency(region_contingency)

    age_rec_rate = events.groupby("age")["recommended"].mean().reset_index()
    age_rec_rate.columns = ["age", "recommendation_rate"]
    age_rec_rate["diff_from_avg"] = age_rec_rate["recommendation_rate"] - overall_rec_rate
    age_rec_rate["potential_bias"] = abs(age_rec_rate["diff_from_avg"]) > 0.10

    age_contingency = pd.crosstab(events["age"], events["recommended"])
    chi2_age, p_age, _, _ = chi2_contingency(age_contingency)

    segment_total_profit = events[events["converted"]].groupby("customer_segment")["profit"].sum().reset_index()
    segment_total_profit.columns = ["customer_segment", "total_profit"]
    segment_total_profit["profit_percentage"] = (
        segment_total_profit["total_profit"] / segment_total_profit["total_profit"].sum()
    ) * 100

    version_segment = events.groupby(["model_version", "customer_segment"]).agg({
        "inference_cost": "sum",
        "profit": "sum",
    }).reset_index()
    version_segment["roi_percentage"] = (
        version_segment["profit"] / version_segment["inference_cost"]
    ) * 100
    roi_pivot = version_segment.pivot(
        index="model_version",
        columns="customer_segment",
        values="roi_percentage",
    )

    version_bias = []
    for version in ["v1.0", "v1.1", "v2.0"]:
        version_data = events[events["model_version"] == version]
        region_cont = pd.crosstab(version_data["region"], version_data["recommended"])
        _, version_p_region, _, _ = chi2_contingency(region_cont)

        age_cont = pd.crosstab(version_data["age"], version_data["recommended"])
        _, version_p_age, _, _ = chi2_contingency(age_cont)

        version_bias.append({
            "model_version": version,
            "region_bias_pvalue": version_p_region,
            "age_bias_pvalue": version_p_age,
        })

    bias_df = pd.DataFrame(version_bias)
    summary = version_performance.merge(bias_df, on="model_version")
    summary["has_bias"] = (
        (summary["region_bias_pvalue"] < 0.05)
        | (summary["age_bias_pvalue"] < 0.05)
    )

    print("Recommendation System Performance Analysis")
    print("=" * 52)
    print(f"Events: {len(events):,}")
    print(f"Purchases: {events['converted'].sum():,}")
    print(f"Conversion rate: {events['converted'].mean():.2%}")
    print(f"Total revenue: {money(total_revenue)}")
    print(f"Total product cost: {money(total_product_cost)}")
    print(f"Total inference cost: {money(total_inference_cost)}")
    print(f"Total conversion cost: {money(total_cost)}")
    print(f"Total profit: {money(total_profit)}")
    print(f"Average profit per conversion: {money(avg_profit_per_conversion)}")
    print(f"Recommendation conversion lift: {conv_lift:.2f}x")
    print(f"Recommendation profit lift: {profit_lift:.2f}x")
    print("\nModel Summary")
    print(summary[[
        "model_version",
        "num_events",
        "conversion_rate",
        "overall_roi_percentage",
        "ai_roi_percentage",
        "total_profit",
        "region_bias_pvalue",
        "age_bias_pvalue",
        "has_bias",
    ]].to_string(index=False))
    print("\nSegment Profit")
    print(segment_total_profit.sort_values("total_profit", ascending=False).to_string(index=False))
    print("\nROI by Segment")
    print(roi_pivot.to_string())
    print("\nBias Tests")
    print(f"Region chi-square: {chi2_region:.2f}; p-value: {p_region:.6f}")
    print(f"Age chi-square: {chi2_age:.2f}; p-value: {p_age:.6f}")


if __name__ == "__main__":
    main()
