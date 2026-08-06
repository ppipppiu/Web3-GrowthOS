from datetime import datetime
from typing import Optional, Dict

from pydantic import BaseModel


class EventSchema(BaseModel):
    """
    Standard Web3 behavioral event schema.

    This schema converts different data sources
    into a unified user behavior event.
    """

    event_id: Optional[str] = None

    wallet_address: str

    event_type: str

    timestamp: datetime

    value: Optional[float] = None

    token: Optional[str] = None

    tx_hash: Optional[str] = None

    contract_address: Optional[str] = None

    source: str

    status: Optional[str] = None

    metadata: Optional[Dict] = None