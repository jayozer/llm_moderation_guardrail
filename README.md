# LLM Moderation Guardrail for Voiceflow

<img src="./vf_llm_moderation_guardrail_logo.png" alt="Moderation Guardrail Logo" width="400" height="300"/>

This function implements a robust moderation guardrail using a variant of the [**G-Eval**](https://arxiv.org/abs/2303.16634) evaluation method. The function scores the presence of unwanted content in LLM responses, providing a flexible framework for content moderation.

## How It Works

The flexible function moderates content by applying specific criteria to content within a defined domain. The process follows these steps:

1. **Define Domain**: Set a domain name that describes the type of content to be moderated.
2. **Establish Criteria**: Clearly outline what the content should and should not contain.
3. **Evaluation Steps**: Provide step-by-step instructions for the LLM to grade the content.
4. **Scoring**: The LLM returns a discrete score from 1-5, indicating compliance with the established criteria.

## Features

- Adaptable to various content types and domains
- Clear, criteria-based evaluation
- Step-by-step LLM-guided assessment
- Quantifiable results for easy interpretation

## Functions

### 1. llm_moderation_guardrails

Inputs:
- `openaiApiKey`
- `chatResponse`

Paths:
- `error`
- `moderation_triggered`
- `continue`

This function does not have any output variables. The 'continue' path signals for the flow to proceed.

### 2. llm_moderation_guardrail_with_score_and_message

Inputs:
- `openaiApiKey`
- `chatResponse`

Paths:
- `error`
- `moderation_triggered`
- `continue`

Outputs:
- `message`
- `score`

This function provides additional outputs for more detailed moderation information.

## Getting Started

To use this moderation guardrail in your Voiceflow project, follow the implementation details provided in the Voiceflow template.
There are three variations for testing the flow in the template llm_moderation_guardrail_example.vf file:
1. Ask a question using the provided Perplexity function, forward the reply to llm moderation guardrail
2. Add your chat response to test if the moderation flag is triggered.
3. Using Voiceflow's Response AI ask the question and return the llm guardrail message and score as a variable to finetuning moderation prompts and the score. Please note that this flow uses the extended version of the function that returns the score and message as a variable.



