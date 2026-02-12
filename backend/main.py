import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List

from database import create_db_and_tables, get_session
from models import Workflow, Run
from schemas import (
    WorkflowCreate,
    WorkflowResponse,
    RunRequest,
    RunResponse,
    StatusResponse,
)
from workflow_engine import run_workflow
from llm_service import call_llm


app = FastAPI(title="Workflow Builder Lite API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create DB tables at startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# ----------------------------
# Create Workflow
# ----------------------------
@app.post("/workflows", response_model=WorkflowResponse)
def create_workflow(
    workflow: WorkflowCreate,
    session: Session = Depends(get_session),
):
    if len(workflow.steps) < 2 or len(workflow.steps) > 4:
        raise HTTPException(status_code=400, detail="Workflow must have 2–4 steps.")

    steps_json = json.dumps([step.dict() for step in workflow.steps])

    db_workflow = Workflow(
        name=workflow.name,
        steps=steps_json
    )

    session.add(db_workflow)
    session.commit()
    session.refresh(db_workflow)

    return WorkflowResponse(
        id=db_workflow.id,
        name=db_workflow.name,
        steps=workflow.steps,
    )


# ----------------------------
# Get All Workflows
# ----------------------------
@app.get("/workflows", response_model=List[WorkflowResponse])
def get_workflows(session: Session = Depends(get_session)):
    workflows = session.exec(select(Workflow)).all()

    response = []
    for wf in workflows:
        response.append(
            WorkflowResponse(
                id=wf.id,
                name=wf.name,
                steps=json.loads(wf.steps),
            )
        )

    return response


# ----------------------------
# Run Workflow
# ----------------------------
@app.post("/run/{workflow_id}", response_model=RunResponse)
def run_workflow_endpoint(
    workflow_id: int,
    request: RunRequest,
    session: Session = Depends(get_session),
):
    if not request.input_text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    workflow = session.get(Workflow, workflow_id)

    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found.")

    outputs = run_workflow(workflow.steps, request.input_text)

    # Save run
    run = Run(
        workflow_id=workflow_id,
        input_text=request.input_text,
        outputs=json.dumps(outputs),
    )

    session.add(run)
    session.commit()

    return RunResponse(
        workflow_id=workflow_id,
        outputs=outputs,
    )


# ----------------------------
# Get Last 5 Runs
# ----------------------------
@app.get("/runs")
def get_last_runs(session: Session = Depends(get_session)):
    runs = session.exec(
        select(Run).order_by(Run.created_at.desc()).limit(5)
    ).all()

    result = []

    for run in runs:
        result.append({
            "id": run.id,
            "workflow_id": run.workflow_id,
            "input_text": run.input_text,
            "outputs": json.loads(run.outputs),
            "created_at": run.created_at,
        })

    return result


# ----------------------------
# Status Endpoint
# ----------------------------
@app.get("/status", response_model=StatusResponse)
def status_check(session: Session = Depends(get_session)):

    # Backend check
    backend_status = "OK"

    # Database check
    try:
        session.exec(select(Workflow)).all()
        db_status = "OK"
    except Exception:
        db_status = "ERROR"

    # LLM check
    try:
        test_response = call_llm("Say OK")
        llm_status = "OK" if "OK" in test_response else "ERROR"
    except Exception:
        llm_status = "ERROR"

    return StatusResponse(
        backend=backend_status,
        database=db_status,
        llm=llm_status,
    )
