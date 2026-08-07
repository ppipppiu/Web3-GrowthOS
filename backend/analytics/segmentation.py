import pandas as pd
from datetime import datetime, timezone



def classify_user(
    profile,
    current_time=None,
    value_threshold=1000,
    active_day_threshold=3,
    inactive_days_threshold=7
):

    """
    Classify Web3 users.
    """


    # -------------------------
    # Normalize current time
    # -------------------------

    if current_time is None:

        current_time = pd.Timestamp.now(
            tz="UTC"
        )


    else:

        current_time = pd.Timestamp(
            current_time
        )


        if current_time.tz is None:

            current_time = current_time.tz_localize(
                "UTC"
            )



    # -------------------------
    # Normalize last activity
    # -------------------------

    last_activity = profile.last_activity


    if last_activity is not None:

        last_activity = pd.Timestamp(
            last_activity
        )


        if last_activity.tz is None:

            last_activity = last_activity.tz_localize(
                "UTC"
            )



    # -------------------------
    # High Value User
    # -------------------------

    if (
        profile.total_value
        >= value_threshold
    ):

        return {

            "segment":
            "High Value User",

            "reason":
            [
                f"Total value {profile.total_value} >= {value_threshold}"
            ]

        }



    # -------------------------
    # At Risk User
    # -------------------------

    if (
        profile.total_events >= 2
        and
        last_activity is not None
    ):

        inactive_days = (
            current_time
            -
            last_activity
        ).days



        if (
            inactive_days
            >= inactive_days_threshold
        ):

            return {

                "segment":
                "At Risk User",

                "reason":
                [
                    f"Inactive for {inactive_days} days",
                    "Previously active user"
                ]

            }



    # -------------------------
    # Active User
    # -------------------------

    if (
        profile.active_days
        >= active_day_threshold
    ):

        return {

            "segment":
            "Active User",

            "reason":
            [
                f"Active days {profile.active_days}"
            ]

        }



    # -------------------------
    # New User
    # -------------------------

    if (
        profile.total_events == 1
    ):

        return {

            "segment":
            "New User",

            "reason":
            [
                "Only one interaction recorded"
            ]

        }



    return {

        "segment":
        "General User",

        "reason":
        [
            "Does not match priority rules"
        ]

    }



def segment_users(
    profiles,
    **kwargs
):

    results = []


    for profile in profiles:


        result = classify_user(
            profile,
            **kwargs
        )


        results.append({

            "wallet_address":
            profile.wallet_address,


            "segment":
            result["segment"],


            "reason":
            result["reason"]

        })


    return results