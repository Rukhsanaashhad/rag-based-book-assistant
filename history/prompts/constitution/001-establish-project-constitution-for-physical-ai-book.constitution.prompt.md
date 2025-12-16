---
id: 001
title: Establish Project Constitution for Physical AI Book
stage: constitution
date: 2025-12-12
surface: agent
model: Gemini
feature: none
branch: master
user: "[USER]"
command: /sp.constitution
labels: ["constitution", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/tasks-template.md
tests:
 - "none"
---

## Prompt

/sp.constitution
Physical AI & Humanoid Robotics – Phase 1: Complete Interactive Book

## Project Goal (Phase 1)
Create and deploy a beautiful, fully-functional, interactive online book titled  
“Physical AI & Humanoid Robotics: Bridging Digital Brains with Physical Bodies”  
using Docusaurus v3 and deploy it to GitHub Pages.

Phase 1 ends the moment the book is 100 % complete, searchable, mobile-friendly, and live at  
https://<your-username>.github.io/physical-ai-book (or custom domain).

No chatbot work in Phase 1 — chatbot is strictly Phase 2.

## Core Specifications
- Repository: GitHub (public or private, your choice)
- Static site generator: Docusaurus 3 (latest)
- Language: English (technical terms in English, explanations clear & student-friendly)
- Tone: Professional yet exciting, mentor-style, motivational. Use simple analogies. Occasional light Hinglish only when it makes concepts stick better.
- Target readers: University students / self-learners with basic Python & AI knowledge who want to enter Physical AI & humanoid robotics.
- Estimated length: 150–200 formatted pages when exported to PDF (≈ 60–80k words + code + diagrams)
- Visual style: Clean Docusaurus default theme + dark mode, plenty of code blocks, Mermaid diagrams, tables, admonitions (note / tip / warning / danger), and embedded YouTube/Github Gist where needed.

## Exact Book Structure (must follow 100 %)
1. Landing Page / Homepage (hero + why this book)
2. Introduction
   - Why Physical AI Matters
   - From Digital AI to Embodied Intelligence
   - Current Humanoid Landscape 2025–2030
3. Module 1 – The Robotic Nervous System (ROS 2)
   Weeks 1–5 content exactly as given in your requirements
4. Module 2 – The Digital Twin (Gazebo & Unity)
   Weeks 6–7
5. Module 3 – The AI-Robot Brain (NVIDIA Isaac Platform)
   Weeks 8–10
6. Module 4 – Vision-Language-Action & Humanoid Development
   Weeks 11–13 + Conversational Robotics
7. Capstone Project – The Autonomous Humanoid
8. Assessments & Grading Rubrics
9. Appendices
   A. Full Hardware Requirements & Cost Tables
   B. Recommended Lab Setups (Home Lab vs Cloud “Ether Lab”)
   C. Economy Jetson Student Kit Shopping List
   D. Troubleshooting & Common Errors
   E. Further Reading & Community Links

## Content Rules (strict)
- Every major concept gets at least one runnable code example (Python + ROS 2)
- All diagrams in Mermaid or high-quality PNG/SVG
- Use Docusaurus admonitions heavily:
  ```md
  :::tip → Quick Tip
  :::warning → Common Mistake
  :::danger → Safety / Hardware Note

## Response snapshot

I have successfully created the project constitution and updated the relevant templates.

- **Created:** `.specify/memory/constitution.md` (Version 1.0.0)
- **Updated:** `.specify/templates/plan-template.md` with constitutional checks.
- **Updated:** `.specify/templates/tasks-template.md` with Docusaurus path conventions.

## Outcome

- ✅ Impact: Established the foundational principles and governance for the project.
- 🧪 Tests: No tests were run.
- 📁 Files: Created the project constitution and updated plan and task templates accordingly.
- 🔁 Next prompts: User may now proceed with `/sp.specify` or `/sp.plan`.
- 🧠 Reflection: The process of deriving principles from the project description was successful. The updates to the templates will ensure future planning aligns with the constitution.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (if applicable): none
