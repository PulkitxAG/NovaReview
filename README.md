## 📝 Description

**NovaReview** is an advanced, client-side intelligence platform designed to audit and optimize tech portfolios for modern applicant tracking systems (ATS) and human technical reviewers[cite: 2, 4]. The application unifies a candidate's self-reported experience with their actual codebase footprint by parsing an uploaded resume and cross-referencing it with live data pulled from their GitHub profile[cite: 2, 3].

### ⚙️ Core Engineering Architecture
The platform runs entirely in the browser without relying on an external database infrastructure[cite: 2, 3]:
1. **Client-Side Document Parsing:** Utilizes `PDF.js` to extract unstructured raw text directly from the user's PDF resume directly in the browser window[cite: 2, 3].
2. **API Orchestration:** Compiles the parsed resume text, active target role, and specified GitHub username into a strict JSON-forcing system prompt architecture[cite: 2, 3]. 
3. **Asynchronous Processing:** Dispatches the multi-layered profile payload asynchronously to a high-throughput LLM model via the Groq API[cite: 3].
4. **Data Synchronization:** Parses the returned structured JSON object in real time to seamlessly map real-time scores, generate dynamic badges, and populates individual expert review blocks[cite: 2, 3].

### 🤖 The 4-Persona AI Agent Architecture
Rather than executing a single, generic overview scanner, NovaReview distributes the profile payload to four distinct, specialized system personas simultaneously to generate a multi-dimensional feedback loop[cite: 2, 3]:

*   **👔 Hiring Manager Panel:** A strict, business-centric auditor evaluating high-level summaries, metric quantification, project scope, and immediate commercial viability[cite: 2].
*   **💻 Principal Engineer Panel:** A deep-dive technical auditor checking for claimed skill authenticity, code verification, actual commit activity, and language proficiency against the user's connected repository data[cite: 2].
*   **📋 Recruiter Panel:** A compliance-focused scan checking structural layout readability, keyword frequency optimization, and keyword matching algorithms standard across modern ATS software[cite: 2].
*   **🎯 Career Coach Panel:** An actionable advisory engine focused on strategic career alignment, identifying technical knowledge gaps, and generating high-impact bullet-point rewrites[cite: 2].

### 🎨 User Experience & Interface
Wrapped in a premium, fluid **Glassmorphism UI**, the site features floating background layout shapes[cite: 2, 4], custom-animated SVG rating scales[cite: 2, 3], client-side confetti triggers for elite scores[cite: 3], responsive layout breakouts[cite: 4], programmatic `jsPDF` reporting utilities[cite: 2, 3], and a strict data-attribute system variable implementation for seamless, zero-latency **Light/Dark theme toggling**[cite: 3, 4].
