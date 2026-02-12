import json
from typing import List, Dict
from llm_service import call_llm


def build_prompt(step_type: str, text: str) -> str:
    """
    Returns appropriate prompt based on step type.
    """

    if step_type == "clean_text":
        return f"Clean the following text and fix grammar without changing meaning:\n\n{text}"

    elif step_type == "summarize":
        return f"Summarize the following text clearly and concisely:\n\n{text}"

    elif step_type == "extract_key_points":
        return f"Extract the key bullet points from the following text:\n\n{text}"

    elif step_type == "tag_category":
        return (
            "Give one category label for the following text. "
            "Choose from: Tech, Finance, Health, Education, Other.\n\n"
            f"{text}"
        )

    else:
        raise ValueError(f"Unsupported step type: {step_type}")


def run_workflow(steps_json: str, input_text: str) -> List[Dict]:
    """
    Executes workflow steps sequentially.
    """

    steps = json.loads(steps_json)
    current_text = input_text
    outputs = []

    for step in steps:
        step_type = step.get("type")

        if not step_type:
            raise ValueError("Step type missing.")

        prompt = build_prompt(step_type, current_text)

        llm_output = call_llm(prompt)

        outputs.append({
            "step": step_type,
            "output": llm_output
        })

        # Pass output to next step
        current_text = llm_output

    return outputs
