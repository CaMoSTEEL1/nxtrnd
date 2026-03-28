# Festival Setup — UGC Studio

Festival (fest.build) is the CLI planning layer installed alongside this project.
It structures work into phases, sequences, and tasks so AI coding agents can execute autonomously without losing context.

---

## Installation

Festival is installed in WSL2 (Windows native support is in progress).

**Binaries**: `~/.local/bin/fest` and `~/.local/bin/camp` (v0.1.2)
**Campaign root**: `~/campaigns/atdc-ugc-studio/` (WSL2 filesystem)
**Project source**: `/mnt/c/Users/edg03/Downloads/proggsu - hacklanta/ATDC - Media Challenge/app`

### Re-install (if needed)

```bash
# In WSL2 terminal:
curl -fsSL https://raw.githubusercontent.com/Obedience-Corp/festival/main/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
```

### Add to shell permanently

```bash
# Append to ~/.bashrc or ~/.zshrc in WSL2:
export PATH="$HOME/.local/bin:$PATH"
eval "$(fest shell-init bash)"
eval "$(camp shell-init bash)"
```

---

## Running Festival Commands

All `fest` and `camp` commands must run **inside WSL2**.

### From Windows Terminal / PowerShell:
```powershell
wsl bash -c "cd ~/campaigns/atdc-ugc-studio && fest status"
wsl bash -c "cd ~/campaigns/atdc-ugc-studio && camp --version"
```

### From Claude Code (bash tool):
```bash
/c/Windows/System32/wsl.exe bash << 'EOF'
export PATH="/home/edg03/.local/bin:$PATH"
cd ~/campaigns/atdc-ugc-studio
fest next
EOF
```

### Inside a WSL2 shell directly:
```bash
export PATH="$HOME/.local/bin:$PATH"
cd ~/campaigns/atdc-ugc-studio
fest status
```

---

## Campaign Structure

```
~/campaigns/atdc-ugc-studio/
├── .campaign/                  # Campaign metadata
│   ├── campaign.yaml           # Name, mission, ID
│   ├── skills/                 # Camp + fest skill docs for AI agents
│   └── settings/
├── festivals/
│   ├── .festival/              # Fest methodology templates
│   ├── planning/               # Festivals in planning state
│   │   └── ugc-studio-mvp-US0001/   # ← Active festival
│   ├── active/                 # Festivals in execution
│   ├── ready/                  # Festivals ready to activate
│   └── dungeon/                # Archived/deprioritized work
├── projects/                   # Git submodules / worktrees
├── workflow/                   # Intents, pipelines, code reviews
├── ai_docs/                    # AI-generated analysis and research
├── docs/                       # Architecture decisions, guides
└── AGENTS.md                   # AI agent instructions (= CLAUDE.md)
```

---

## Active Festival: ugc-studio-mvp-US0001

**Goal**: Build a working AI influencer UGC video generator for the ATDC hackathon demo.
**Path**: `~/campaigns/atdc-ugc-studio/festivals/planning/ugc-studio-mvp-US0001/`
**Score**: 100/100 (validated)

### Phase Plan

| Phase | Type | Status | Description |
|-------|------|--------|-------------|
| 001_INGEST | Ingest | Pending | Understand codebase, spec, design system |
| 002_PLAN | Planning | Pending | Produce implementation sequences + task files |
| 003_IMPLEMENT* | Implementation | — | Build all API routes, UI, AI chains, video pipeline |
| 004_VERIFY* | Review | — | End-to-end test, polish, ATDC submission |

*003 and 004 to be created after 002_PLAN completes.*

---

## Key Commands

```bash
# Navigate to campaign
cd ~/campaigns/atdc-ugc-studio

# Check festival status and progress
fest status

# See the next task to execute
fest next

# Mark current task complete
fest task completed

# Validate festival structure
fest validate

# List all festivals
fest list

# Campaign health check
camp doctor
camp status all
```

---

## Execution Workflow

1. `cd ~/campaigns/atdc-ugc-studio`
2. `fest next` — shows the next task with full context
3. Execute the task in Claude Code (working on Windows project source)
4. `fest task completed` — marks it done, advances context
5. Repeat until phase gate is reached
6. `fest workflow advance` — moves to next phase

---

## Campaign YAML

Location: `~/campaigns/atdc-ugc-studio/.campaign/campaign.yaml`

```yaml
name: ATDC UGC Studio
id: 393a48ee-dd0c-469e-96f0-b94b54f557b5
type: product
description: AI Influencer UGC Content Generator for sports brands
mission: Ship a working demo that generates TikTok-ready videos with AI influencers — persona to video in under 2 minutes
```

---

## GitHub

- **fest CLI**: https://github.com/Obedience-Corp/fest
- **camp CLI**: https://github.com/Obedience-Corp/camp
- **Festival methodology**: https://github.com/Obedience-Corp/festival
- **Docs**: https://docs.fest.build
- **Website**: https://fest.build

> Note: The correct GitHub org is `Obedience-Corp`, not `festival-ai`.
> Windows native support (scoop) is in progress — use WSL2 until then.
