import pandas as pd

from backend.schemas.user_schema import UserProfileSchema



def generate_user_profiles(
    events: pd.DataFrame
):
    """
    Generate user profiles from
    standardized Web3 events.

    Input:
        Clean Event DataFrame

    Output:
        List[UserProfileSchema]
    """


    profiles = []


    grouped = events.groupby(
        "wallet_address"
    )


    for wallet, user_events in grouped:

        profile = UserProfileSchema(

            wallet_address=wallet,


            total_events=len(
                user_events
            ),


            total_value=
            user_events["value"]
            .fillna(0)
            .sum(),


            active_days=
            user_events["timestamp"]
            .dt.date
            .nunique(),


            first_activity=
            user_events["timestamp"]
            .min(),


            last_activity=
            user_events["timestamp"]
            .max(),


            event_types=
            user_events["event_type"]
            .unique()
            .tolist()

        )


        profiles.append(profile)


    return profiles