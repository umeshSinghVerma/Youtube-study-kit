export default function TrainingChromePrompt(subtitleChunk, videoId, language) {
  return `
  ## Instructions:

  This prompt has two main goals:

  1. **Generate Keywords:** Create a comma-separated list of at least 20 keywords. These keywords are **essential** for evaluating your understanding of the text. Be specific, capture the nuances of the content, and ensure they are relevant to the main topics discussed.  These keywords will be used to assess your ability to identify the core themes and concepts.

  2. **Prepare for Questions:** Answer questions based on the subtitles, adhering to the formatting guidelines.

  
  
  **Answer Formatting Guidelines:**
  
  * **Structured Responses:** Use headings (##), subheadings (###, ####), and lists (* or 1.) for every answer do not write just paragraph break them down into bullet points headings subheadings.
  * **Timestamp References (REQUIRED for EVERY paragraph):**
  * **Format:** {time}
  * **Timestamp Value:** Use the "startOffset" and "endOffset" value from the JSON.
  * **Accuracy:** The timestamp should point to the video section most relevant to the paragraph's content.
  * **Earliest Timestamp:** If multiple subtitles relate to a paragraph, use the earliest relevant timestamp.
  * **Placement:**  Place the timestamp reference at the end of *every* paragraph.
  * **No Fabricated Answers:** If information isn't present, state "Information not found in the provided subtitles."
  **Example:**
    ## Video Walk-Through:

    This video discusses **orthogonal matrices**, a specific type of square matrix. Here's a breakdown of the key concepts and content:

    ### 1. Introduction to Transpose and Inverse {24}  
    The video starts by revisiting the concepts of **transposed** and **inverse matrices**. It emphasizes that an orthogonal matrix utilizes both of these operations.

    ### 2. Defining Orthogonal Matrices {58}  
    The core definition of an orthogonal matrix is presented: it's a square matrix where the **inverse of the matrix is equal to its transpose**.

    ### 3. Demonstrating Orthogonality {120}  
    To illustrate this, the video uses the example of the **identity matrix (I)**. The identity matrix is a square matrix with ones on its main diagonal and zeros elsewhere.

    - **Q * Qᵀ = I:** The video shows that when an orthogonal matrix Q is multiplied by its transpose Qᵀ, the result is the identity matrix. This demonstrates that Q and Qᵀ are indeed orthogonal.  
    - **Rows are Orthogonal:** The rows of Q are also orthogonal vectors. If you multiply two rows of Q, the result is always 1 (since they represent different directions).  
    - **Columns are Orthogonal:** The columns of Q are also orthogonal vectors. The same principle applies to the dot product of any two columns of Q.

    ### 4. Orthogonality in Action (Qxᵀ) {180}  
    The video then introduces the concept of multiplying an orthogonal matrix Q by a column vector x. It demonstrates that the transpose of the product Qxᵀ is simply the square of the length of Qx.

    ### 5. Qᵀ * Qx = xᵀQᵀ {235}  
    The video further explains this by deriving an alternative formula for Qᵀ * Qx: xᵀQᵀ. This formula emphasizes that the dot product of QᵀQx and xᵀQx are equal.

    ### 6. Identity Matrix as a Key {298}  
    The video highlights that when multiplying an orthogonal matrix Q by the identity matrix I, the outcome is simply the matrix itself. This reinforces the idea that the identity matrix acts as an "identity" element for orthogonal matrices.


    Example 2

    ## Video Topics and Subtopics:

    ### 1. Introduction to Transpose and Inverse {0}  
    - **Transpose Matrix**  
    - **Inverse Matrix**

    ### 2. Defining Orthogonal Matrices {30}  
    - **Orthogonal Matrix Definition**  
    - **Identity Matrix**

    ### 3. Demonstrating Orthogonality {58}  
    - **Example: Identity Matrix**  
      - **Q * Qᵀ = I**  
      - **Rows are Orthogonal**  
      - **Columns are Orthogonal**

    ### 4. Orthogonality in Action (Qxᵀ) {80}  
    - **Multiplying Orthogonal Matrix by a Column Vector**  
    - **Qxᵀ = xᵀQᵀ**

    ### 5. Qᵀ * Qx = xᵀQᵀ {120}  
    - **Alternative Formula for Qᵀ * Qx**  
    - **Dot Product Identity**

    ### 6. Identity Matrix as a Key {150}  
    - **Q * I = Q**  
    - **Conclusion**



    **It is very necessary to include time after every paragraph in curly braces**
    **The time strictly should not be any range for example 00:05-00:10 is not acceptable**
    **The time strictly should be an integer value enclosed in the curly braces**
    **Only give the time if you find the integer timestamp from the json provided below otherwise do not give the wrong formatted time**


  
  **Subtitles (JSON):**

  \`\`\`json
  ${subtitleChunk}
  \`\`\`

  **Now, generate your keywords and be ready to answer questions, *strictly following these guidelines*.  The quality of your keywords and the correct placement of timestamps directly impacts the evaluation of your understanding.**
  `;
}
