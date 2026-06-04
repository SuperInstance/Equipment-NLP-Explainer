# CONSTRUCT-MIGRATION: Equipment-NLP-Explainer

**Date:** 2026-06-04 · **Source:** TypeScript → Rust

This document shows how to port the NLPExplainer Equipment to a Rust skill compatible with construct-core and ternary-registry.

---

## Source Overview

The NLPExplainer is an `EXPLANATION`-slot Equipment that:
- Generates human-readable descriptions of cell logic and operations
- Explains **WHY** decisions were made, not just **WHAT**
- Supports multi-language output (English, Spanish, Chinese)
- Creates prose-form audit trails
- Translates confidence scores into human-understandable terms
- Generates reasoning chain explanations

```typescript
class NLPExplainer implements Equipment {
  readonly name = 'NLPExplainer';
  readonly slot: EquipmentSlot = 'EXPLANATION';
  readonly version = '1.0.0';
  readonly cost: CostMetrics = { memoryBytes: 30_000_000, cpuPercent: 10, latencyMs: 200, costPerUse: 0.0005 };
}
```

---

## Rust Skill Definition

### ternary-registry Registration

```rust
use ternary_registry::*;

fn nlp_explainer_skill() -> Skill {
    Skill::new(
        SkillId::new("superinstance", "NLPExplainer", SemVersion::new(1, 0, 0)),
        SkillTier::Standard,
        "Generates human-readable descriptions of cell logic and operations",
    )
    .with_capability("natural_language_explanation")
    .with_capability("why_analysis")
    .with_capability("confidence_translation")
    .with_capability("audit_trail_generation")
    .with_capability("multi_language_support")
    .with_capability("reasoning_chain_explanation")
    .with_capability("read")
    .with_capability("query")
    .with_capability("write")
    .with_capability("compute")
}
```

### Core Rust Types

```rust
use std::collections::HashMap;

/// Supported languages.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Language {
    English,   // "en"
    Spanish,   // "es"
    Chinese,   // "zh"
}

impl Language {
    pub fn code(&self) -> &'static str {
        match self {
            Language::English => "en",
            Language::Spanish => "es",
            Language::Chinese => "zh",
        }
    }
}

/// A complete NLP explanation.
#[derive(Debug, Clone)]
pub struct NLPExplanation {
    pub id: String,
    pub language: Language,
    pub summary: String,
    pub details: ExplanationDetails,
    pub steps: Vec<ExplanationStep>,
    pub reasoning_chain: Vec<ReasoningStep>,
    pub confidence_explanation: ConfidenceExplanation,
    pub audit_trail: Vec<AuditTrailEntry>,
    pub insights: Vec<String>,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct ExplanationDetails {
    pub what: String,
    pub why: String,
    pub how: String,
    pub inputs: String,
    pub outputs: String,
    pub alternatives: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ExplanationStep {
    pub step_number: usize,
    pub description: String,
    pub step_type: StepType,
    pub result: String,
    pub reasoning: String,
    pub confidence: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum StepType {
    Input, Processing, Decision, Output, Validation,
}

#[derive(Debug, Clone)]
pub struct ReasoningStep {
    pub id: String,
    pub description: String,
    pub premise: String,
    pub conclusion: String,
    pub evidence: Vec<String>,
    pub confidence: f32,
    pub next_step_id: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ConfidenceExplanation {
    pub raw_score: f32,
    pub level: String,
    pub description: String,
    pub factors: Vec<ConfidenceFactor>,
    pub interpretation: String,
}

#[derive(Debug, Clone)]
pub struct ConfidenceFactor {
    pub name: String,
    pub description: String,
    pub impact: Impact,
    pub magnitude: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Impact { Positive, Negative, Neutral }

#[derive(Debug, Clone)]
pub struct AuditTrailEntry {
    pub id: String,
    pub timestamp: u64,
    pub action: String,
    pub actor: String,
    pub description: String,
    pub result: String,
    pub confidence: f32,
}

/// A logic pattern to be explained.
#[derive(Debug, Clone)]
pub struct LogicPattern {
    pub id: String,
    pub name: String,
    pub pattern_type: PatternType,
    pub inputs: Vec<PatternInput>,
    pub outputs: Vec<PatternOutput>,
    pub conditions: Vec<EvaluatedCondition>,
    pub transformations: Vec<AppliedTransformation>,
    pub confidence: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PatternType {
    Decision, Transformation, Validation, Aggregation,
    Branching, Iteration, Composition, Fallback,
}

#[derive(Debug, Clone)]
pub struct PatternInput {
    pub name: String,
    pub value: String,
    pub source: String,
    pub was_used: bool,
}

#[derive(Debug, Clone)]
pub struct PatternOutput {
    pub name: String,
    pub value: String,
    pub is_final: bool,
}

#[derive(Debug, Clone)]
pub struct EvaluatedCondition {
    pub expression: String,
    pub result: bool,
    pub reasoning: String,
    pub confidence: f32,
}

#[derive(Debug, Clone)]
pub struct AppliedTransformation {
    pub transform_type: String,
    pub description: String,
    pub reasoning: String,
}
```

### Core Implementation

```rust
/// NLPExplainer — generates human-readable descriptions of cell logic.
pub struct NLPExplainer {
    translator: LogicTranslator,
    confidence_explainer: ConfidenceExplainer,
    explanation_cache: HashMap<String, NLPExplanation>,
    options: ExplainerOptions,
}

#[derive(Debug, Clone)]
pub struct ExplainerOptions {
    pub language: Language,
    pub detail_level: DetailLevel,
    pub include_reasoning_chain: bool,
    pub include_audit_trail: bool,
    pub include_confidence: bool,
    pub max_length: usize,
    pub target_audience: Audience,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DetailLevel { Brief, Normal, Detailed, Comprehensive }

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Audience { Technical, Business, General, Expert }

impl Default for ExplainerOptions {
    fn default() -> Self {
        Self {
            language: Language::English,
            detail_level: DetailLevel::Normal,
            include_reasoning_chain: true,
            include_audit_trail: true,
            include_confidence: true,
            max_length: 5000,
            target_audience: Audience::General,
        }
    }
}

impl NLPExplainer {
    pub fn new(options: ExplainerOptions) -> Self {
        Self {
            translator: LogicTranslator::new(options.language),
            confidence_explainer: ConfidenceExplainer::new(options.language),
            explanation_cache: HashMap::new(),
            options,
        }
    }

    /// Explain a logic pattern.
    pub fn explain(&mut self, pattern: &LogicPattern) -> NLPExplanation {
        let cache_key = format!("{}-{}", pattern.id, self.options.language.code());

        if let Some(cached) = self.explanation_cache.get(&cache_key) {
            return cached.clone();
        }

        let summary = self.translator.build_summary(pattern);
        let details = self.translator.build_details(pattern);
        let steps = self.translator.build_steps(pattern);
        let reasoning_chain = if self.options.include_reasoning_chain {
            self.translator.build_reasoning_chain(pattern)
        } else {
            Vec::new()
        };
        let confidence_explanation = self.confidence_explainer
            .explain_confidence(pattern.confidence);
        let audit_trail = if self.options.include_audit_trail {
            self.generate_audit_trail(pattern)
        } else {
            Vec::new()
        };

        let explanation = NLPExplanation {
            id: format!("expl_{}", current_timestamp_ms()),
            language: self.options.language,
            summary,
            details,
            steps,
            reasoning_chain,
            confidence_explanation,
            audit_trail,
            insights: self.translator.extract_insights(pattern),
            timestamp: current_timestamp_ms(),
        };

        self.explanation_cache.insert(cache_key, explanation.clone());
        explanation
    }

    /// Explain WHY a decision was made.
    pub fn explain_why(&self, pattern: &LogicPattern) -> String {
        let mut lines = Vec::new();
        lines.push(self.explain_what(pattern));
        lines.push(String::new());

        match self.options.language {
            Language::English => lines.push("The reason is:".into()),
            Language::Spanish => lines.push("La razón es:".into()),
            Language::Chinese => lines.push("原因是：".into()),
        }

        for cond in &pattern.conditions {
            let prefix = if cond.result { "✓" } else { "✗" };
            lines.push(format!("  {} {}", prefix, cond.reasoning));
        }

        for t in &pattern.transformations {
            lines.push(format!("  • {}", t.reasoning));
        }

        lines.join("\n")
    }

    /// Explain WHAT was decided.
    pub fn explain_what(&self, pattern: &LogicPattern) -> String {
        let finals: Vec<_> = pattern.outputs.iter().filter(|o| o.is_final).collect();
        if finals.is_empty() {
            return match self.options.language {
                Language::Chinese => "没有产生最终决策".into(),
                Language::Spanish => "No se produjo ninguna decisión final".into(),
                Language::English => "No final decision was produced".into(),
            };
        }

        let values: Vec<String> = finals.iter()
            .map(|o| format!("\"{}\"", o.value))
            .collect();
        let output = values.join(", ");

        match self.options.language {
            Language::Chinese => format!("最终决策是：{}", output),
            Language::Spanish => format!("La decisión final fue: {}", output),
            Language::English => format!("The final decision was: {}", output),
        }
    }

    /// Explain HOW the decision was made.
    pub fn explain_how(&self, pattern: &LogicPattern) -> String {
        let mut lines = Vec::new();
        lines.push("## Decision Process".into());

        // 1. Gather Inputs
        let used: Vec<_> = pattern.inputs.iter().filter(|i| i.was_used).collect();
        if !used.is_empty() {
            lines.push(String::new());
            lines.push("### 1. Gather Inputs".into());
            for input in used {
                lines.push(format!("- {} (from {})", input.name, input.source));
            }
        }

        // 2. Evaluate Conditions
        if !pattern.conditions.is_empty() {
            lines.push(String::new());
            lines.push("### 2. Evaluate Conditions".into());
            for cond in &pattern.conditions {
                let icon = if cond.result { "✓" } else { "✗" };
                lines.push(format!("{} {} (confidence: {:.0}%)", icon, cond.expression, cond.confidence * 100.0));
            }
        }

        // 3. Apply Transformations
        if !pattern.transformations.is_empty() {
            lines.push(String::new());
            lines.push("### 3. Apply Transformations".into());
            for t in &pattern.transformations {
                lines.push(format!("- [{}] {}", t.transform_type, t.description));
            }
        }

        // 4. Generate Output
        lines.push(String::new());
        lines.push("### 4. Generate Output".into());
        for output in &pattern.outputs {
            lines.push(format!("→ {} = {}", output.name, output.value));
        }

        lines.join("\n")
    }

    fn generate_audit_trail(&self, pattern: &LogicPattern) -> Vec<AuditTrailEntry> {
        let mut entries = Vec::new();
        let base_time = current_timestamp_ms();

        // Input entry
        let used: Vec<_> = pattern.inputs.iter().filter(|i| i.was_used).collect();
        if !used.is_empty() {
            entries.push(AuditTrailEntry {
                id: format!("audit-input-{}", base_time),
                timestamp: base_time,
                action: "input_received".into(),
                actor: "system".into(),
                description: format!("{} inputs processed", used.len()),
                result: format!("{} inputs received", used.len()),
                confidence: 1.0,
            });
        }

        // Condition evaluation entries
        for (i, cond) in pattern.conditions.iter().enumerate() {
            entries.push(AuditTrailEntry {
                id: format!("audit-cond-{}-{}", base_time, i),
                timestamp: base_time + ((i + 1) * 100) as u64,
                action: "condition_evaluated".into(),
                actor: "logic_engine".into(),
                description: cond.reasoning.clone(),
                result: if cond.result { "condition_passed".into() } else { "condition_failed".into() },
                confidence: cond.confidence,
            });
        }

        // Output entry
        entries.push(AuditTrailEntry {
            id: format!("audit-output-{}", base_time),
            timestamp: base_time + ((pattern.conditions.len() + 1) * 100) as u64,
            action: "output_generated".into(),
            actor: "system".into(),
            description: "Final output generated".into(),
            result: format!("confidence: {:.2}", pattern.confidence),
            confidence: pattern.confidence,
        });

        entries
    }
}

/// Translates logic patterns into natural language.
pub struct LogicTranslator {
    language: Language,
}

impl LogicTranslator {
    pub fn new(language: Language) -> Self {
        Self { language }
    }

    pub fn build_summary(&self, pattern: &LogicPattern) -> String {
        let finals: Vec<_> = pattern.outputs.iter().filter(|o| o.is_final).collect();
        match self.language {
            Language::English => format!(
                "The '{}' pattern produced {} output(s) with {:.0}% confidence.",
                pattern.name, finals.len(), pattern.confidence * 100.0
            ),
            Language::Spanish => format!(
                "El patrón '{}' produjo {} salida(s) con {:.0}% de confianza.",
                pattern.name, finals.len(), pattern.confidence * 100.0
            ),
            Language::Chinese => format!(
                "'{}' 模式产生了 {} 个输出，置信度为 {:.0}%。",
                pattern.name, finals.len(), pattern.confidence * 100.0
            ),
        }
    }

    pub fn build_details(&self, pattern: &LogicPattern) -> ExplanationDetails {
        ExplanationDetails {
            what: self.explain_what_text(pattern),
            why: self.explain_why_text(pattern),
            how: self.explain_how_text(pattern),
            inputs: pattern.inputs.iter().map(|i| i.name.clone()).collect::<Vec<_>>().join(", "),
            outputs: pattern.outputs.iter().map(|o| format!("{}={}", o.name, o.value)).collect::<Vec<_>>().join(", "),
            alternatives: None,
        }
    }

    pub fn build_steps(&self, pattern: &LogicPattern) -> Vec<ExplanationStep> {
        let mut steps = Vec::new();
        let mut n = 0;

        // Input step
        if !pattern.inputs.is_empty() {
            n += 1;
            steps.push(ExplanationStep {
                step_number: n,
                description: "Gather inputs".into(),
                step_type: StepType::Input,
                result: format!("{} inputs collected", pattern.inputs.len()),
                reasoning: "Input data is required for processing".into(),
                confidence: 1.0,
            });
        }

        // Condition steps
        for cond in &pattern.conditions {
            n += 1;
            steps.push(ExplanationStep {
                step_number: n,
                description: cond.expression.clone(),
                step_type: StepType::Decision,
                result: if cond.result { "true".into() } else { "false".into() },
                reasoning: cond.reasoning.clone(),
                confidence: cond.confidence,
            });
        }

        steps
    }

    pub fn build_reasoning_chain(&self, pattern: &LogicPattern) -> Vec<ReasoningStep> {
        pattern.conditions.iter().enumerate().map(|(i, cond)| {
            ReasoningStep {
                id: format!("step-{}", i),
                description: cond.expression.clone(),
                premise: cond.expression.clone(),
                conclusion: if cond.result { "true".into() } else { "false".into() },
                evidence: vec![cond.reasoning.clone()],
                confidence: cond.confidence,
                next_step_id: Some(format!("step-{}", i + 1)),
            }
        }).collect()
    }

    pub fn extract_insights(&self, pattern: &LogicPattern) -> Vec<String> {
        let mut insights = Vec::new();
        let true_conds = pattern.conditions.iter().filter(|c| c.result).count();
        let total_conds = pattern.conditions.len();
        if total_conds > 0 {
            insights.push(format!("{}/{} conditions evaluated to true", true_conds, total_conds));
        }
        insights.push(format!("Overall confidence: {:.0}%", pattern.confidence * 100.0));
        insights
    }

    fn explain_what_text(&self, pattern: &LogicPattern) -> String {
        let outputs: Vec<_> = pattern.outputs.iter().filter(|o| o.is_final).collect();
        if outputs.is_empty() { return "No output produced".into(); }
        outputs.iter().map(|o| o.value.clone()).collect::<Vec<_>>().join(", ")
    }

    fn explain_why_text(&self, pattern: &LogicPattern) -> String {
        pattern.conditions.iter()
            .map(|c| c.reasoning.clone())
            .collect::<Vec<_>>()
            .join("; ")
    }

    fn explain_how_text(&self, pattern: &LogicPattern) -> String {
        format!("{} transformation(s) applied", pattern.transformations.len())
    }
}

/// Explains confidence scores in human terms.
pub struct ConfidenceExplainer {
    language: Language,
}

impl ConfidenceExplainer {
    pub fn new(language: Language) -> Self { Self { language } }

    pub fn explain_confidence(&self, score: f32) -> ConfidenceExplanation {
        let (level, description, interpretation) = match score {
            s if s >= 0.9 => ("Very High".into(), "Extremely confident in the result".into(), "This result can be trusted with high certainty".into()),
            s if s >= 0.7 => ("High".into(), "Confident in the result".into(), "This result is likely correct".into()),
            s if s >= 0.5 => ("Moderate".into(), "Somewhat confident".into(), "This result should be verified".into()),
            s if s >= 0.3 => ("Low".into(), "Not very confident".into(), "This result needs additional validation".into()),
            _ => ("Very Low".into(), "Low confidence".into(), "This result should not be trusted without verification".into()),
        };

        ConfidenceExplanation {
            raw_score: score,
            level,
            description,
            factors: Vec::new(),
            interpretation,
        }
    }
}
```

---

## construct-core Integration

### Layer: L1 (SyncConstruct)

The explainer needs heap for caching and string manipulation but is synchronous. Maps to `SyncConstruct`:

```rust
impl NLPExplainer {
    /// Called via SyncConstruct::load_skill()
    pub fn on_load(&mut self) {
        self.explanation_cache.clear();
    }

    /// Called via SyncConstruct::unload_skill()
    pub fn on_unload(&mut self) {
        self.explanation_cache.clear();
    }

    /// Called via SyncConstruct::query_owned()
    pub fn on_query(&mut self, query: &OwnedQuery) -> Result<OwnedResponse, ConstructError> {
        let pattern: LogicPattern = serde_json::from_slice(&query.payload)
            .map_err(|_| ConstructError::InvalidQuery)?;

        let explanation = self.explain(&pattern);
        let payload = serde_json::to_vec(&explanation)
            .map_err(|_| ConstructError::NotAvailable)?;

        Ok(OwnedResponse::new(TritAction::Choose, pattern.confidence, payload))
    }
}
```

---

## Dependencies

```toml
[package]
name = "equipment-nlp-explainer"
version = "0.1.0"
edition = "2021"

[dependencies]
construct-core = { path = "../construct-core", features = ["alloc"] }
ternary-registry = { path = "../ternary-registry" }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

---

## Pairing with CellLogicDistiller

The NLP Explainer is a natural pair with the CellLogicDistiller:

```rust
// In a construct-core agent:
// 1. Load both skills
agent.load_skill(SkillId::from_u8(/* Distiller */))?;
agent.load_skill(SkillId::from_u8(/* Explainer */))?;

// 2. Distill logic → get tiles
let distill_result = distiller.distill(&input);

// 3. For each tile, generate explanation
for tile in &distill_result.tiles {
    let pattern = tile_to_pattern(tile);
    let explanation = explainer.explain(&pattern);
    println!("Tile {}: {}", tile.name, explanation.summary);
}
```

In the room-as-codespace vision, the Distiller decomposes and the Explainer narrates — a natural pair for any "logic audit" room.
