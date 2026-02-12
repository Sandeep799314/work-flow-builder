from typing import List
from pydantic import BaseModel


# ---------- Step Schema ----------

class Step(BaseModel):
    type: str  # clean_text | summarize | extract_key_points | tag_category


# ---------- Workflow Schemas ----------

class WorkflowCreate(BaseModel):
    name: str
    steps: List[Step]


class WorkflowResponse(BaseModel):
    id: int
    name: str
    steps: List[Step]


# ---------- Run Schemas ----------

class RunRequest(BaseModel):
    input_text: str


class StepOutput(BaseModel):
    step: str
    output: str


class RunResponse(BaseModel):
    workflow_id: int
    outputs: List[StepOutput]


# ---------- Status Schema ----------

class StatusResponse(BaseModel):
    backend: str
    database: str
    llm: str
