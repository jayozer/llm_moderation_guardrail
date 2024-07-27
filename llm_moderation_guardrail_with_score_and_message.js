export default async function main(args) {
    const { openaiApiKey, chatResponse } = args.inputVars;
    if (!chatResponse || !openaiApiKey) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: "Missing required input variable: chatResponse or openaiApiKey" } }],
            outputVars: {
                score: null,
                message: "Missing required input variables"
            }
        };
    }
    const url = `https://api.openai.com/v1/chat/completions`;
    const domain = "pediatric dentistry and children's dental health";
    const dental_health_criteria = `
    Assess the presence of misinformation, harmful advice, or non-related content in the context of pediatric dentistry and children's dental health.
    The content should:
    1. Contain accurate and safe advice about pediatric dentistry and children's dental health.
    2. Be relevant to pediatric dentistry and children's dental health.`;
    const dental_health_steps = `
        1. Read the content and the criteria carefully.
    2. Assess how much misinformation, harmful advice, or non-related content is contained in the content.
    3. Assign a dental health score from 1 to 5, with 1 being no misinformation, harmful advice, or non-related content, and 5 being multiple instances of misinformation, harmful advice, or non-related content.`;
    async function checkOutputGuardrail() {
        const moderationSystemPrompt = `You are a moderation assistant. Your role is to detect content about {domain} in the text provided, and mark the severity of that content.
        ## {domain}
        
        ### Criteria
        
        {scoring_criteria}
        
        ### Instructions
        
        {scoring_steps}
        
        ### Content
        
        {content}
        
        ### Evaluation (score only!)`;
      
        const modMessages = [
            {
                "role": "user",
                "content": moderationSystemPrompt.replace('{domain}', domain)
                                                  .replace('{scoring_criteria}', dental_health_criteria)
                                                  .replace('{scoring_steps}', dental_health_steps)
                                                  .replace('{content}', chatResponse)
            },
        ];
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: modMessages,
                temperature: 0
            })
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json;
        
        return data.choices[0].message.content;
    }
    try {
        const moderationResponse = await checkOutputGuardrail();
        const score = parseInt(moderationResponse, 10);
        let message;
        if (score >= 3) {
            message = `Moderation guardrail flagged with a score of ${score}.`;
            return {
                next: { path: 'moderation_triggered' },
                trace: [{ type: "debug", payload: { message } }],
                outputVars: {
                    score,
                    message
                }
            };
        } else {
            message = "Passed moderation.";
            return {
                next: { path: 'continue' },
                trace: [{ type: "debug", payload: { message } }],
                outputVars: {
                    score,
                    message
                }
            };
        }
    } catch (error) {
        return {
            next: { path: 'error' },
            trace: [{ type: "debug", payload: { message: `Error in moderation guardrail: ${error.message}` } }],
            outputVars: {
                score: null,
                message: `Error in moderation guardrail: ${error.message}`
            }
        };
    }

}