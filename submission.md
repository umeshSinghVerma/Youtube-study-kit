# Submission for Google Chrome Built-in AI Challenge

## Project Title: YouTube Study Kit Chrome Extension

### Project Description

The YouTube Study Kit Chrome Extension enhances the way users engage with educational content on YouTube by integrating advanced features powered by Chrome’s built-in AI APIs. The extension empowers users to take timestamped snapshots with annotations, generate comprehensive study notes, and interact with AI-driven tools for summarization, multilingual translation, and Q&A making it an ultimate revision kit.

### Problem Statement

Studying from YouTube videos can be challenging due to the unstructured nature of video content. Users often struggle with manually capturing screenshots, pasting them into documents, adding annotations, and linking timestamps for future review. This cumbersome process makes it difficult to create organized, comprehensive notes that are easy to revisit. Language barriers further complicate the process for non-English speakers who wish to understand video content thoroughly. 

### The Ultimate Revision Kit

The YouTube Study Kit Chrome Extension transforms video-based studying by providing an efficient, streamlined solution for learners. It enables users to:

- **Take annotated, timestamped snapshots**: Capture and annotate key moments directly from videos, eliminating the need to switch between applications.

- **Summarize lengthy videos**: Generate concise summaries of video content for quick reviews.

- **Translate and interact in preferred languages**: Leverage translation tools to ensure understanding across different languages.

- **Engage with AI-powered Q&A**: Ask questions related to the video content and receive in-depth, contextual answers.

### Core Functionalities

#### 1\. Snapshot and Annotation

- **Effortless Capture and Note-Taking**: Users can take screenshots of specific video frames with timestamps and add text or drawing annotations directly within the extension.

- **Streamlined Workflow**: No more manually pasting images into documents or adding timestamps by hand; everything is seamlessly integrated into the YouTube Study Kit.

#### 2\. PDF Generation with Embedded Links

- **Interactive Study PDFs**: The extension compiles annotated snapshots into a well-organized PDF. Each image within the PDF is embedded with a clickable link that redirects to the exact timestamp in the original video, making it easy to revisit the source.

- **Ultimate Revision Resource**: This feature transforms the PDF into an unparalleled revision kit, allowing users to review notes efficiently and access relevant video sections with a single click.

- **Playlist Note Organization**: Users can consolidate notes from an entire playlist into a single PDF for comprehensive study sessions.

#### 3\. **Subtitle Extraction and Multilingual Support**

- The extension extracts subtitle data using the YouTube video ID.

- The **Chrome Language Detection API** automatically identifies the subtitle language.

- If needed, the **Chrome Translation API** translates subtitles into English so that it can be processed by Chrome Prompt Api, ensuring non-English speakers can fully comprehend the content and AI model can also respond to non English Videos.

#### 4\. **Interactive AI-Powered Q&A**

- Subtitle data serves as a system prompt for the **Chrome Prompt API**, training an AI model to respond to user questions based on video content.

- Users can ask questions to gain deeper insights into the material, with the output translated into their preferred language using the **Translation API**.

- The system maintains seamless multilingual capabilities to cater to global users.

#### 5\. **Summarization of Video Content**

- Subtitle data is processed using the **Summarization API** to create concise summaries, helping users quickly grasp the main points of lengthy videos.

- Summaries can be generated in the user’s language of choice, thanks to the integration with the **Translation API**.

### Technical Highlight: Chunking and Model Management

- **Chunking Strategy**: Subtitle data is split into manageable segments due to length constraints. The extension divides subtitles into chunks that fit within the prompt limits of the APIs.

- **Model Management**: Multiple instances of AI models handle different chunks, and a supervising model aggregates the results.

- **Load Balancing**: The extension determines which chunk should be processed by which model, ensuring balanced loads and efficient performance.

- **Offline Functionality**: All operations, including chunk processing and translation, are executed in-browser without server calls, enhancing user privacy and reliability.

### APIs Utilized

- **Prompt API**: Trains models for user-specific Q&A.

- **Summarization API**: Condenses video content into brief, understandable summaries.

- **Translation API**: Translates subtitle text and AI outputs into different languages.

- **Language Detection API**: Automatically detects the subtitle language to facilitate multilingual processing.

### What to Submit

- **GitHub Repository**: \[URL to be provided\]

- **Demo Video**: A 3-minute demonstration video showcasing all key functionalities and user interactions.

- **Detailed Text Description**: This document and accompanying README file in the repository.

- **Feedback (Optional)**: Insights on development challenges and opportunities will be shared through the feedback form.

### Conclusion

The YouTube Study Kit Chrome Extension exemplifies the capabilities of Chrome’s built-in AI APIs, providing an innovative, offline solution for video-based learning that is interactive, multilingual, and efficient. The tool equips users with everything needed to turn YouTube videos into powerful study aids, making learning from online video content more structured and accessible to all.