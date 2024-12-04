# 🎓 YouTube Study Kit  

## 🌟 Inspiration
Exams are about to come in a month and you are watching countless educational videos on YouTube, feeling productive and prepared. But then, exam week arrives, and the real challenge begins—revision. You think to yourself, "How am I going to review all these videos in time?"

Your options?<br/>
1️⃣ Pause every few seconds to jot down notes—tedious and time-consuming.<br/>
2️⃣ Screenshot key moments, paste them into a Word document, and scramble to add context—frustrating, right?<br/>
3️⃣ Spend hours organizing everything instead of actually revising.<br/>
<br/>
And then, just when you need clarity the most, a doubt pops up about a concept or explanation. **You wish you could directly ask the tutor in the video, "Can you explain that part again?"**

What if there was a better way?
What if you could:

Watch videos, take snapshots of important moments, and instantly get a clean, organized PDF—complete with timestamps and all your notes?
Ask questions directly about the video and get detailed, timestamped answers from an AI-powered tutor simulating the expertise of the instructor?
That’s exactly why we created YouTube Study Kit: a tool that takes the effort out of revision and provides quick doubt resolution, so you can focus on what matters most—learning and acing your exams!

## 🚀 What it does  
YouTube Study Kit is a Chrome extension designed to revolutionize the way students engage with YouTube educational content. It offers:  
- ✍️ **Timestamped Notes**: Take snapshots of video moments with timestamps while watching. These are compiled into a PDF where each snapshot is clickable, taking you back to the exact video moment.  
- 📂 **Playlist Notes**: Combine notes from entire playlists into one organized PDF, reducing clutter.  
- 🤖 **AI-Powered Assistance**: Summarize videos, clarify doubts, and get detailed explanations with AI responses that include timestamps.  
- 🌍 **Multilingual Support**: Ask questions in any language and receive responses in your preferred language, breaking down language barriers in learning.  
- 🔌 **Offline Mode**: The Chrome-built-in AI works offline, ensuring you can access its features without an internet connection.  

## 🛠️ How to Use  

### 🎥 GIF Demonstration: Taking Notes and Downloading PDFs  
![GIF of note-taking process](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Fast%20Demonstration.gif?raw=true)  

1. 🖱️ Click the button to take screenshots of the video.  
2. 📝 Jot down notes during or after learning.  
3. 📄 Download notes as a PDF for a single video or the entire playlist.  

### 🎥 GIF Demonstration: Using the AI Chat Feature  
![GIF of AI chat process](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Fast%20video%20(2).gif?raw=true)  

1. 🤔 Ask any question about the video in the AI chat.  
2. ⏩ Click on the timestamps provided by the AI agent to jump directly to the relevant moment in the video.

### 🎥 GIF Demonstration: Multilingual AI Responses  
![GIF of multilingual feature in action](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Language%20Translation.gif?raw=true)  

1. 🌍 **Ask a Question in Any Language**: Type a question in your preferred language
2. 🔁 **AI Responds in the Same Language**: Get a detailed response tailored to your query, including timestamps.  
3. ⏩ **Click Timestamps to Jump to Video Moments**: Navigate directly to the relevant part of the video, even in a different language!  

**Why it’s powerful**:  
- Breaks down language barriers for global learners.  
- Ensures seamless understanding of complex topics in your native language.  


## 📝 Try It Out  
Want to see how it works? Check out these sample PDFs:  

- [📄 Sample Video Notes PDF](https://drive.google.com/file/d/1z1S5Ckruni16N1Logj7yTIyZKU7uKbMM/view?usp=sharing)  
- [📄 Sample Playlist Notes PDF](https://drive.google.com/file/d/14wrGZylxL5JR9_5Yveb1KiK9sqdnFk64/view?usp=sharing)  

## 🔄 How it Works  

### 📊 Process Flow Diagram  
![Flow Diagram](https://github.com/umeshSinghVerma/Youtube-study-kit/blob/master/Assets/Untitled-2024-12-03-1346.png?raw=true)  

1. 🖊️ The user enters a query or takes an action (e.g., asking a question or taking a screenshot).  
2. 🗣️ The input is processed through a **language detector** to identify the query's language.  
3. 🔍 The system trains multiple **prompts** based on the context and generates identifier keywords.  
4. 💡 A **master prompt session** determines which session should handle the query.  
5. 🔄 The appropriate session processes the query and sends it to a **language translator** for the user’s preferred language.  
6. ✅ The output is displayed, and timestamps are synced for seamless learning.  

## 🔌 Used Chrome Built-in APIs  
To power its features, the YouTube Study Kit uses several Chrome Built-in APIs:  

1. 🌐 **Language Detection API**: Automatically detects the language of the user’s query to provide accurate processing.  
2. 🌍 **Translation API**: Converts responses into the user’s preferred language for better understanding.  
3. 🧠 **Prompt API**: Handles multiple trained prompts to contextualize and address queries effectively.  
4. ✍️ **Summarization API**: Provides concise summaries of videos or specific timestamps for quicker insights.  

## 🛠️ How We Built It  
- 🎨 **Frontend**: Chrome extension UI developed with React, Tailwindcss, and JavaScript for user interactions.  
- 🖥️ **Backend**: Node.js for handling requests and processing data from YouTube and the AI model.  
- 🧠 **AI Integration**: Chrome Built in model for generating summaries, answering questions, and providing explanations.  
- 📄 **PDF Generation**: Leveraged libraries like React pdf to create dynamic and interactive PDF files.  
- 🌐 **Multilingual Support**: Integrated Chrome inbuilt translation APIs for language adaptability.  

## ⚡ Challenges We Ran Into  
- 🕒 Ensuring seamless timestamp-linking in the PDF and syncing it with YouTube video playback.  
- 🌍 Optimizing the AI for regional language support while maintaining accuracy and usability.  
- 📂 Handling large data loads from extended playlists and multiple notes without affecting performance.  
- 🛠️ Building an intuitive and user-friendly UI to cater to diverse student needs.  

## 🎉 Accomplishments That We’re Proud Of  
- 🌐 Successfully implementing multilingual AI support to make education accessible to learners worldwide.  
- 📝 Providing an efficient way to consolidate and access study notes directly from YouTube videos.  
- 📄 Creating a streamlined, interactive PDF experience for easy revision.  
- 🔌 Implementing offline AI functionality for uninterrupted learning.  

## 📚 What We Learned  
- 🤝 The importance of balancing feature complexity with user-friendliness.  
- 🧠 The potential of AI in enhancing traditional educational workflows.  
- 🌍 Addressing global accessibility by prioritizing multilingual and offline compatibility.  
- 🚀 Leveraging user feedback to refine and improve functionalities.  

## 🚀 What’s Next for YouTube Study Kit  
- 📱 **Mobile Support**: Extend the functionality to mobile platforms for on-the-go learners.  
- 🗣️ **Enhanced AI Features**: Include voice queries and responses for better accessibility.  
- 🤝 **Community Features**: Enable sharing of notes and playlists among peers for collaborative learning.  

We believe the YouTube Study Kit is a game-changer for learners worldwide 🌎 and are excited to continue improving it for a brighter educational future!  
