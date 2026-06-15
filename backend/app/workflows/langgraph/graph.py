from langgraph.graph import StateGraph, END
from app.workflows.langgraph.state import IncidentState
from app.workflows.langgraph.nodes import (
    analyze_node,
    retrieve_memories_node,
    generate_root_cause_node,
    generate_resolution_node,
    generate_postmortem_node,
    store_learning_node
)

def build_incident_workflow():
    """
    Builds and compiles the LangGraph StateGraph for incident resolution.
    """
    workflow = StateGraph(IncidentState)
    
    # Add nodes
    workflow.add_node("analyze", analyze_node)
    workflow.add_node("retrieve", retrieve_memories_node)
    workflow.add_node("root_cause", generate_root_cause_node)
    workflow.add_node("resolution", generate_resolution_node)
    workflow.add_node("postmortem", generate_postmortem_node)
    workflow.add_node("store_learning", store_learning_node)
    
    # Define execution flow
    workflow.set_entry_point("analyze")
    workflow.add_edge("analyze", "retrieve")
    workflow.add_edge("retrieve", "root_cause")
    workflow.add_edge("root_cause", "resolution")
    workflow.add_edge("resolution", "postmortem")
    workflow.add_edge("postmortem", "store_learning")
    workflow.add_edge("store_learning", END)
    
    # Compile the graph
    app = workflow.compile()
    return app

# Expose a compiled singleton for easy import
incident_workflow = build_incident_workflow()
