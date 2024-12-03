# YouTube Study Kit Chrome Extension

![Demo](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Fast%20video%20(2).gif?raw=true)

![Demo](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Fast%20Demonstration.gif?raw=true)


## Purpose

The YouTube Study Kit Chrome Extension is designed to assist users in studying from YouTube videos by enabling timestamped snapshots with annotations, which are then compiled into a downloadable PDF. This extension aims to make video-based studying more efficient and organized, while also supporting future AI-powered summarization features for enhanced learning.

## Features

### 1\. YouTube Player Integration

- The extension injects a content script into YouTube pages, adding two custom buttons directly to the YouTube player toolbar at the bottom.
- These buttons allow users to take snapshots of the video at specific timestamps and annotate them as needed.

### 2\. Snapshot Functionality

#### First Button (Basic Snapshot)

- **Capture**: Takes a screenshot of the current video frame with the exact timestamp.
- **Canvas Processing**: The frame is painted onto an HTML canvas element, and a data URI (specifically a Blob URI) of the image is generated from this canvas.
- **Annotation Toast**: A toast notification appears on the side of the video player, allowing the user to add text annotations relevant to the snapshot.

#### Second Button (Snapshot with Drawing Tool)

- **Capture with Drawing Overlay**: Takes a similar snapshot but opens an overlay with a drawing toolbar.
- **Annotation Tool**: The toolbar allows users to draw or write directly on the snapshot (e.g., highlight, underline). These drawings are saved directly onto the image, merging with the original snapshot to modify the image’s data URI.

#### Storage

- All snapshots, annotations, and timestamps are saved as data blob URIs in `chrome.storage.local`, making them accessible across tabs within the extension’s scope.

### 3\. Popup Interface for Accessing Stored Data

- When users open `popup.html` in the extension, they can access the saved snapshot data from `chrome.storage.local`.
- **YouTube Video ID**: The extension accesses the active YouTube tab's URL to retrieve the video ID, which is used to create timestamped links back to the video.
- This setup provides a consolidated view of all snapshots and annotations taken for the specific YouTube video, with metadata including timestamps, snapshot images, and text annotations.

### 4\. PDF Generation

- The extension uses `react-pdf` to dynamically generate a PDF document containing all snapshots in sequential order.
- Each snapshot in the PDF includes:
  - **Image with Annotations**: The annotated snapshot (text or drawing-based).
  - **Timestamped Video Link**: A link that, when clicked, opens the YouTube video at the specific timestamp in the same browser tab.
  - **Text Annotations**: Any annotation text provided by the user, displayed below each image.
- **Downloadable PDF**: Users can download this PDF, creating a permanent, organized study resource for each video.

### 5\. AI-Powered Summarization and Chat with Video

- The extension is designed to support integration with Chrome built in Ai APIs for enhanced study tools:
  - **Subtitle Extraction**: Retrieves the full subtitle data with timestamps from YouTube videos.
  - **Summarization**: Generates a concise summary of the video, helping users quickly review the main points.
  - **Contextual Q&A**: Allows users to ask follow-up questions based on the video content, with Chrome Built-in generating responses that consider the subtitle context.

---

With these features, the YouTube Study Helper Chrome Extension is a comprehensive tool for interactive and efficient video-based learning, combining timestamped snapshots, annotations, and downloadable study resources with future potential for AI-driven summarization and flashcards.
