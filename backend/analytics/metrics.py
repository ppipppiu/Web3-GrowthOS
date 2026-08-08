import pandas as pd



def calculate_growth_metrics(
    events: pd.DataFrame,
    profiles: list
):
    """
    Calculate Web3 growth metrics.

    Parameters:
        events:
            Clean Event DataFrame

        profiles:
            UserProfileSchema list


    Returns:
        metrics dictionary
    """


    metrics = {}


    # -----------------------
    # User scale
    # -----------------------


    total_users = (
        events["wallet_address"]
        .nunique()
    )


    metrics["total_users"] = (
        total_users
    )


    metrics["total_events"] = (
        len(events)
    )



    # -----------------------
    # Value metrics
    # -----------------------


    if "value" in events.columns:

        metrics["total_value"] = (
            events["value"]
            .fillna(0)
            .sum()
        )

    else:

        metrics["total_value"] = 0



    # -----------------------
    # User behavior
    # -----------------------


    metrics["average_events_per_user"] = (

        metrics["total_events"]

        /

        total_users

        if total_users > 0

        else 0

    )



    # -----------------------
    # Active users
    # active_days > 1
    # -----------------------


    active_users = [

        p

        for p in profiles

        if p.active_days > 1

    ]


    metrics["active_users"] = (
        len(active_users)
    )



    # -----------------------
    # Repeat users
    # events > 1
    # -----------------------


    repeat_users = [

        p

        for p in profiles

        if p.total_events > 1

    ]


    metrics["repeat_users"] = (
        len(repeat_users)
    )



    metrics["repeat_rate"] = (

        len(repeat_users)

        /

        total_users

        if total_users > 0

        else 0

    )


    return metrics