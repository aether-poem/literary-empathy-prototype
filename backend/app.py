#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Literary Empathy TRPG Pipeline", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WorldStateRequest(BaseModel):
    text: str = Field(..., min_length=1)
    max_chars: int = Field(1200, ge=300, le=3000)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/world-state")
def create_world_state(request: WorldStateRequest):
    try:
        from pipeline import run_pipeline_from_text

        return run_pipeline_from_text(request.text, max_chars=request.max_chars)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
