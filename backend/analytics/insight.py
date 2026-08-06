def generate_growth_insights(
    metrics,
    segments
):

    insights = []


    total_users = metrics.get(
        "total_users",
        0
    )


    active_users = metrics.get(
        "active_users",
        0
    )


    total_value = metrics.get(
        "total_value",
        0
    )



    # -----------------------
    # Engagement Insight
    # -----------------------

    if total_users > 0:

        active_rate = (
            active_users /
            total_users
        )


        if active_rate < 0.5:

            insights.append({

                "type":
                "Engagement",

                "level":
                "warning",

                "insight":
                "Most wallets have limited activity.",

                "recommendation":
                "Improve onboarding and encourage repeat interactions."

            })


        else:

            insights.append({

                "type":
                "Engagement",

                "level":
                "positive",

                "insight":
                "Wallet activity is relatively healthy.",

                "recommendation":
                "Continue optimizing lifecycle campaigns."

            })



    # -----------------------
    # Value Insight
    # -----------------------

    if total_users > 0:


        avg_value = (
            total_value /
            total_users
        )


        if avg_value > 1000:

            insights.append({

                "type":
                "Value",

                "level":
                "positive",

                "insight":
                "Users show strong value contribution.",

                "recommendation":
                "Focus on retaining high-value wallets."

            })


        else:

            insights.append({

                "type":
                "Value",

                "level":
                "warning",

                "insight":
                "Average wallet value is relatively low.",

                "recommendation":
                "Increase user activation and engagement."

            })



    # -----------------------
    # Segment Insight
    # -----------------------

    high_value = segments.count(
        {
            "segment":
            "High Value User"
        }
    )


    insights.append({

        "type":
        "Segmentation",

        "level":
        "info",

        "insight":
        f"{high_value} wallets are identified as high-value users.",

        "recommendation":
        "Build differentiated strategies for different wallet groups."

    })


    return insights