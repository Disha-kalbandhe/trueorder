from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


class OrderStatus(str, Enum):
    RECEIVED = "received"
    VALIDATED = "validated"
    EXCEPTION = "exception"
    CONFIRMED = "confirmed"
    BILLED = "billed"


class OrderItem(BaseModel):
    sku: Optional[str] = None
    raw_product_name: str
    quantity: int
    unit_price: Optional[float] = None
    matched_in_catalog: bool = False


class ConflictFlag(BaseModel):
    field: str
    pdf_value: str
    email_value: str
    resolved_value: str
    reason: str


class Order(BaseModel):
    id: Optional[str] = None
    customer_name: str
    customer_email: str
    source_email_id: str
    items: List[OrderItem]
    total_amount: Optional[float] = None
    status: OrderStatus = OrderStatus.RECEIVED
    conflicts: List[ConflictFlag] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    exception_reason: Optional[str] = None


class RepairSuggestion(BaseModel):
    order_id: str
    unmatched_term: str
    suggested_sku: str
    suggested_product_name: str
    confidence: float