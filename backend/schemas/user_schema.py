from datetime import datetime
from typing import List

from pydantic import BaseModel


class UserProfileSchema(BaseModel):
    """
    User-level profile generated from behavioral events.
    """

    wallet_address: str

    total_events: int = 0

    total_value: float = 0

    active_days: int = 0

    first_activity: datetime | None = None

    last_activity: datetime | None = None

    event_types: List[str] = []

    segment: str | None = None