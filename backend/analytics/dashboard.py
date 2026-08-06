def build_dashboard_response(
    metrics,
    profiles,
    segments,
    insights=None,
    growth_strategy=None
):
    """
    Build frontend dashboard response.

    v0.3 upgrade:

    Added:
    Growth Insights
    """



    # -----------------------
    # Overview Cards
    # -----------------------

    overview = {

        "total_users":
            metrics.get(
                "total_users",
                0
            ),


        "total_events":
            metrics.get(
                "total_events",
                0
            ),


        "total_value":
            metrics.get(
                "total_value",
                0
            ),


        "active_users":
            metrics.get(
                "active_users",
                0
            ),


        "repeat_rate":
            metrics.get(
                "repeat_rate",
                0
            )

    }



    # -----------------------
    # Segment Distribution
    # -----------------------

    segment_distribution = {}


    for item in segments:

        segment = item["segment"]


        if segment not in segment_distribution:

            segment_distribution[segment] = 0


        segment_distribution[segment] += 1




    # -----------------------
    # Segment Value Distribution
    # -----------------------

    segment_value_distribution = {}


    segment_map = {

        item["wallet_address"]:
            item["segment"]

        for item in segments

    }



    for profile in profiles:


        wallet = profile["wallet_address"]


        segment = segment_map.get(
            wallet,
            "Unknown"
        )


        value = profile.get(
            "total_value",
            0
        )



        if segment not in segment_value_distribution:

            segment_value_distribution[segment] = 0



        segment_value_distribution[segment] += value





    # -----------------------
    # User Table
    # -----------------------

    users = []



    for profile in profiles:


        users.append({

            "wallet_address":
                profile["wallet_address"],


            "total_events":
                profile["total_events"],


            "total_value":
                profile["total_value"],


            "active_days":
                profile["active_days"],


            "segment":
                segment_map.get(

                    profile["wallet_address"],

                    "Unknown"

                )

        })





    # -----------------------
    # Final Dashboard JSON
    # -----------------------

    return {


        "overview":
            overview,


        "segment_distribution":
            segment_distribution,


        "segment_value_distribution":
            segment_value_distribution,


        "growth_insights":
            insights if insights else [],


        "growth_strategy":
            growth_strategy if growth_strategy else {},


        "users":
            users

    }