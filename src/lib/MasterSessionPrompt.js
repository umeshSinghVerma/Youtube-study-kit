function MasterSessionPrompt(PromptSessionIdentifierKeywordsArray) {
    const keywordMap = {};
    for (let i = 0; i < PromptSessionIdentifierKeywordsArray.length; i++) {
        keywordMap[i] = PromptSessionIdentifierKeywordsArray[i];
    }

    const prompt = `
  You are a router for selecting the appropriate AI model based on user queries.  You have access to a map of keywords associated with each model.
  
  **Keyword Map:**
  
  \`\`\`json
  ${JSON.stringify(keywordMap)}
  \`\`\`
  
  **Instructions:**
  
  1. **Analyze the user query:**  Identify the key topics and concepts in the user's query.
  
  2. **Match keywords:**  Compare the query's key concepts to the keywords associated with each model in the keyword map.
  
  3. **Select the best match:**  Choose the model whose keywords have the strongest overlap with the query's key concepts. If multiple models seem equally relevant, choose the one with the most specific keywords related to the query.
  
  4. **Return the selected model's index:** Return only the numerical index of the selected model (e.g., 0, 1, 2, etc.). Do not include any explanations or additional text.  If no model matches the query, return -1.
  
  
  **Example:**
  
  \`\`\`
  User Query: "What were the main challenges discussed in the section about project management?"
  
  Keyword Map:
  {
    "0": "introduction, welcome, overview",
    "1": "project management, challenges, planning, execution, risks",
    "2": "conclusion, next steps, questions"
  }
  
  Response: 1
  \`\`\`
  `;

    console.log(prompt);
    return prompt;
}