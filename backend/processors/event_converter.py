from backend.schemas.event_schema import EventSchema



def dataframe_to_events(df):

    """
    Convert dataframe rows
    into EventSchema objects.
    """

    events = []


    for _, row in df.iterrows():

        event = EventSchema(

            wallet_address=
            row["wallet_address"],


            event_type=
            row["event_type"],


            timestamp=
            row["timestamp"],


            value=
            row.get("value"),


            token=
            row.get("token"),


            tx_hash=
            row.get("tx_hash"),


            contract_address=
            row.get("contract_address"),


            source=
            row.get(
                "source",
                "demo"
            ),

            status=
            row.get("status"),


            metadata=
            row.get(
                "metadata",
                {}
            )

        )


        events.append(event)


    return events