import pandas as pd

from backend.processors.normalization import normalize_events
from backend.processors.cleaning import clean_events
from backend.processors.event_converter import dataframe_to_events

from backend.analytics.user_profile import generate_user_profiles
from backend.analytics.metrics import calculate_growth_metrics
from backend.analytics.segmentation import segment_users
from backend.analytics.dashboard import build_dashboard_response
from backend.analytics.insight import generate_growth_insights
from backend.services.ai_strategy import generate_growth_strategy



class AnalysisPipeline:
    """
    Main v0.3 Web3 Growth Intelligence pipeline.

    Added:
    Growth Insight Engine
    """

    def run(
        self,
        df: pd.DataFrame
    ):

        result = {}


        # -----------------------
        # 1. Normalize Raw Data
        # -----------------------

        normalized_df = normalize_events(df)


        result["normalized_rows"] = len(
            normalized_df
        )


        print(
            "Step 1 finished: normalization"
        )



        # -----------------------
        # 2. Cleaning
        # -----------------------

        clean_df, cleaning_report = (
            clean_events(normalized_df)
        )


        result["cleaning"] = cleaning_report


        print(
            "Step 2 finished: cleaning"
        )



        # -----------------------
        # 3. Event Schema
        # -----------------------

        events = dataframe_to_events(
            clean_df
        )


        result["event_count"] = len(events)


        print(
            "Step 3 finished: event conversion"
        )



        # -----------------------
        # 4. User Profile
        # -----------------------

        profiles = generate_user_profiles(
            clean_df
        )


        result["profiles"] = [

            profile.model_dump()
            if hasattr(
                profile,
                "model_dump"
            )
            else profile.dict()

            for profile in profiles

        ]


        print(
            "Step 4 finished: user profile"
        )



        # -----------------------
        # 5. Growth Metrics
        # -----------------------

        metrics = calculate_growth_metrics(
            clean_df,
            profiles
        )


        result["metrics"] = metrics


        print(
            "Step 5 finished: metrics"
        )



        # -----------------------
        # 6. User Segmentation
        # -----------------------

        segments = segment_users(
            profiles
        )


        result["segments"] = segments


        print(
            "Step 6 finished: segmentation"
        )



        # -----------------------
        # 7. Growth Insight Engine
        # -----------------------

        insights = generate_growth_insights(
            metrics,
            segments
        )


        result["insights"] = insights


        print(
            "Step 7 finished: growth insights"
        )

        # -----------------------
        # AI Strategy Generation
        # -----------------------

        growth_strategy = generate_growth_strategy(
            insights,
            metrics,
            segments
        )


        result["growth_strategy"] = growth_strategy



        # -----------------------
        # 8. Dashboard Response
        # -----------------------

        dashboard = build_dashboard_response(

            metrics,

            result["profiles"],

            segments,

            insights,

            growth_strategy

        )


        result["dashboard"] = dashboard


        print(
            "Step 8 finished: dashboard"
        )



        print(
            "Pipeline finished successfully"
        )


        print(
            result.keys()
        )


        return result