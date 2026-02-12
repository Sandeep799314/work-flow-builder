from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Workflow(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    steps: str  # JSON string of steps
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Run(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workflow_id: int
    input_text: str
    outputs: str  # JSON string of step outputs
    created_at: datetime = Field(default_factory=datetime.utcnow)
