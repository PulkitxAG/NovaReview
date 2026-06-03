document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // DARK / LIGHT THEME TOGGLE
    // ============================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('nova-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('nova-theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = theme === 'dark'
            ? '<i class="ph-bold ph-sun"></i>'
            : '<i class="ph-bold ph-moon"></i>';
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // LIVE ANALYSER
    // ============================================
    const form = document.getElementById('analyzer-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const resultsContent = document.getElementById('results-content');
    const overallScore = document.getElementById('overall-score');
    const scoreRingFill = document.getElementById('score-ring-fill');
    const goodTags = document.getElementById('good-tags');
    const badTags = document.getElementById('bad-tags');
    const hmReview = document.getElementById('hm-review');
    const peReview = document.getElementById('pe-review');
    const recReview = document.getElementById('rec-review');
    const ccReview = document.getElementById('cc-review');

    // ============================================
    // LOADING TIPS
    // ============================================
    const loadingTips = [
        "💡 Quantify achievements — 'Increased sales by 30%' beats 'Improved sales'.",
        "💡 Tailor your resume keywords to each job description.",
        "💡 Keep your resume to 1 page if under 5 years experience.",
        "💡 GitHub contributions show real coding activity to engineers.",
        "💡 Use action verbs: Built, Led, Designed, Optimized, Shipped.",
        "💡 Remove outdated skills like 'Microsoft Word' from tech resumes.",
        "💡 A strong summary statement can double your interview callbacks.",
        "💡 ATS systems scan for exact keyword matches — use the job's language.",
        "💡 Pin your best GitHub repos for maximum profile impact.",
        "💡 Avoid photos, graphics, or tables — ATS can't read them.",
        "💡 List your most recent experience first — reverse chronological order.",
        "💡 Include your LinkedIn URL in your contact section.",
        "💡 Spell out acronyms at least once — ATS may not recognize shortcuts.",
        "💡 Use consistent formatting — same font, size, and spacing throughout.",
        "💡 Add a skills section with both hard and soft skills.",
        "💡 Avoid using 'responsible for' — use action verbs instead.",
        "💡 A clean, simple layout beats a fancy design for ATS systems.",
        "💡 Include relevant certifications — they boost ATS scores significantly.",
        "💡 Don't list every job — only relevant experience for the target role.",
        "💡 Use bullet points, not paragraphs, for work experience.",
        "💡 Having side projects shows passion beyond your day job.",
        "💡 Open source contributions are gold for engineering roles.",
        "💡 A README on your GitHub repos shows communication skills.",
        "💡 Recruiters spend average 7 seconds on first resume scan — make it count.",
        "💡 Match your job title to the role you're applying for when possible.",
    ];
    let tipInterval = null;

    function startLoadingTips() {
        const tipEl = document.getElementById('loading-tip');
        if (!tipEl) return;
        const shuffled = [...loadingTips].sort(() => Math.random() - 0.5);
        let i = 0;
        tipEl.textContent = shuffled[i];
        tipInterval = setInterval(() => {
            i = (i + 1) % shuffled.length;
            tipEl.style.opacity = 0;
            setTimeout(() => {
                tipEl.textContent = shuffled[i];
                tipEl.style.opacity = 1;
            }, 400);
        }, 2500);
    }

    function stopLoadingTips() {
        if (tipInterval) clearInterval(tipInterval);
    }

    // ============================================
    // FILE UPLOAD
    // ============================================
    const fileUploadZone = document.getElementById('file-upload-zone');
    const fileInput = document.getElementById('resume-file');
    const uploadContent = document.getElementById('upload-content');
    const filePreview = document.getElementById('file-preview');
    const fileNameDisplay = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file-btn');
    let selectedFile = null;

    if (fileUploadZone && fileInput) {
        fileUploadZone.addEventListener('click', (e) => {
            if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
                fileInput.click();
            }
        });
        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) handleFileSelection(this.files[0]);
        });
        fileUploadZone.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadZone.classList.add('dragover'); });
        fileUploadZone.addEventListener('dragleave', (e) => { e.preventDefault(); fileUploadZone.classList.remove('dragover'); });
        fileUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.name.match(/\.(pdf|doc|docx)$/i)) handleFileSelection(file);
                else alert('Please upload a PDF or Word document.');
            }
        });
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedFile = null;
            fileInput.value = '';
            filePreview.classList.add('hidden');
            uploadContent.classList.remove('hidden');
        });
    }

    function handleFileSelection(file) {
        selectedFile = file;
        fileNameDisplay.textContent = file.name;
        uploadContent.classList.add('hidden');
        filePreview.classList.remove('hidden');
    }

    // Target Role toggle
    const targetRoleSelect = document.getElementById('target-role');
    const customRoleGroup = document.getElementById('custom-role-group');
    const customRoleInput = document.getElementById('custom-role');
    if (targetRoleSelect && customRoleGroup) {
        targetRoleSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                customRoleGroup.classList.remove('hidden');
                customRoleInput.required = true;
            } else {
                customRoleGroup.classList.add('hidden');
                customRoleInput.required = false;
            }
        });
    }

    async function extractTextFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function (e) {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(' ') + "\n";
                    }
                    resolve(fullText);
                } catch (err) { reject(err); }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Store last result for PDF download
    let lastResult = null;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- FIXED: API Key completely removed from here ---
            const githubUser = document.getElementById('github-user').value.trim();
            let targetRole = targetRoleSelect ? targetRoleSelect.value : '';
            if (targetRole === 'Other') targetRole = customRoleInput ? customRoleInput.value.trim() : '';

            emptyState.classList.add('hidden');
            resultsContent.classList.add('hidden');
            loadingState.classList.remove('hidden');
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Analyzing...';
            startLoadingTips();

            try {
                let resumeText = 'Not provided';
                if (selectedFile) {
                    if (selectedFile.name.endsWith('.pdf')) resumeText = await extractTextFromPDF(selectedFile);
                    else resumeText = `[Uploaded File: ${selectedFile.name}]`;
                }

                const systemPrompt = `You are the NovaReview Engine: a 4-in-1 expert consisting of a strict Hiring Manager, a highly technical Principal Engineer, an ATS-focused Recruiter, and an empathetic Career Coach.
Your task is to review the provided candidate data (GitHub username data, target role, and resume text).
Output ONLY valid JSON with the following structure:
{
  "overall_score": 0-100,
  "tags": [{"name": "Tag1", "type": "positive|negative|warning"}],
  "hiring_manager_review": "...", 
  "principal_engineer_review": "...", 
  "recruiter_review": "...", 
  "career_coach_review": "..." 
}
Be harsh but constructive. Format your string responses using basic HTML tags (like <p>, <ul>, <li>, <strong>) for readability. The tags array MUST contain 15-20 tags. Each tag name must be SHORT — maximum 3 words. Never write full sentences as tags.`;

                const userPrompt = `Please analyze the following candidate:
- GitHub Username: ${githubUser || 'Not specified'}
- Target Role: ${targetRole || 'Not specified'}
- Resume Text: ${resumeText}
Provide the JSON review. Output only the JSON.`;

                // --- SECURE BACKEND ROUTE ---
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemPrompt: systemPrompt,
                        userPrompt: userPrompt
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error?.message || `API Error: ${response.status}`);
                }

                // --- FIXED: Reading direct data from serverless backend safely ---
                const responseData = await response.json();

                // --- FIXED CLEAN VERSION ---
                let finalizedData = responseData;
                if (responseData.choices) {
                    let rawText = responseData.choices[0].message.content;
                    // Adding backslashes (\) before the backticks stops VS Code from showing errors
                    rawText = rawText.replace(/^`\`\`json/i, '').replace(/^`\`\`/i, '').replace(/`\`\`$/i, '').trim();
                    finalizedData = JSON.parse(rawText);
                } else if (typeof responseData === 'string') {
                    finalizedData = JSON.parse(responseData.replace(/^`\`\`json/i, '').replace(/^`\`\`/i, '').replace(/`\`\`$/i, '').trim());
                }

                lastResult = { ...finalizedData, githubUser, targetRole };
                renderResults(finalizedData);

            } catch (error) {
                console.error("Error during analysis:", error);
                alert("Failed to analyze. Details: " + error.message);
                loadingState.classList.add('hidden');
                emptyState.classList.remove('hidden');
            } finally {
                stopLoadingTips();
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="ph-bold ph-magic-wand"></i> Run AI Analysis';
            }
        });
    }

    // ============================================
    // CONFETTI ANIMATION
    // ============================================
    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 8 + 4,
            color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
            speed: Math.random() * 4 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 4 - 2,
        }));

        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.angle * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
                p.y += p.speed;
                p.angle += p.spin;
            });
            frame++;
            if (frame < 180) requestAnimationFrame(draw);
            else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
        }
        draw();
    }

    // ============================================
    // RENDER RESULTS
    // ============================================
    function renderResults(result) {
        loadingState.classList.add('hidden');
        resultsContent.classList.remove('hidden');

        const score = result.overall_score || 0;

        setTimeout(() => {
            const ringColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
            scoreRingFill.style.strokeDasharray = `${score}, 100`;
            scoreRingFill.style.stroke = ringColor;
            overallScore.style.color = ringColor;
            animateValue(overallScore, 0, score, 1500);

            if (score >= 80) setTimeout(launchConfetti, 800);
        }, 100);

        goodTags.innerHTML = '';
        badTags.innerHTML = '';
        if (result.tags && Array.isArray(result.tags)) {
            result.tags.forEach(tagObj => {
                const tagEl = document.createElement('span');
                const tagObjValue = typeof tagObj === 'object' ? tagObj.name : tagObj;
                const tagTypeValue = typeof tagObj === 'object' ? tagObj.type : 'info';
                const tagType = tagTypeValue === 'warning' ? 'neutral' : (tagTypeValue || 'info');
                tagEl.className = `tag ${tagType}`;
                tagEl.textContent = tagObjValue;
                if (tagTypeValue === 'positive') goodTags.appendChild(tagEl);
                else badTags.appendChild(tagEl);
            });
            if (goodTags.children.length === 0) goodTags.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">None found</span>';
            if (badTags.children.length === 0) badTags.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">None found</span>';
        }

        hmReview.innerHTML = result.hiring_manager_review || '<p>No data provided.</p>';
        peReview.innerHTML = result.principal_engineer_review || '<p>No data provided.</p>';
        recReview.innerHTML = result.recruiter_review || '<p>No data provided.</p>';
        ccReview.innerHTML = result.career_coach_review || '<p>No data provided.</p>';
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // ============================================
    // PDF DOWNLOAD
    // ============================================
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!lastResult) return;
            generatePDF(lastResult);
        });
    }

    function stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function generatePDF(result) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const W = 210, margin = 18;
        let y = 0;

        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, W, 38, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('NovaReview', margin, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('AI Resume & GitHub Analysis Report', margin, 27);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 34);

        y = 50;

        doc.setFillColor(245, 245, 255);
        doc.roundedRect(margin, y, W - margin * 2, 28, 4, 4, 'F');
        const scoreColor = result.overall_score >= 80 ? [16, 185, 129] : result.overall_score >= 60 ? [245, 158, 11] : [239, 68, 68];
        doc.setTextColor(...scoreColor);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(`${result.overall_score}%`, margin + 8, y + 19);
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(11);
        doc.text('Overall Match Score', margin + 32, y + 13);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        if (result.targetRole) doc.text(`Target Role: ${result.targetRole}`, margin + 32, y + 21);
        if (result.githubUser) doc.text(`GitHub: ${result.githubUser}`, margin + 32, y + 27);

        y += 36;

        const positiveTags = result.tags?.filter(t => t.type === 'positive').map(t => t.name) || [];
        const negativeTags = result.tags?.filter(t => t.type !== 'positive').map(t => t.name) || [];

        function addTagSection(title, tags, color) {
            if (tags.length === 0) return;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.text(title, margin, y);
            y += 6;
            let x = margin;
            tags.forEach(tag => {
                const tw = doc.getTextWidth(tag) + 6;
                if (x + tw > W - margin) { x = margin; y += 8; }
                doc.setFillColor(...color);
                doc.setDrawColor(...color);
                doc.roundedRect(x, y - 5, tw, 7, 2, 2, 'FD');
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(tag, x + 3, y);
                x += tw + 3;
            });
            y += 12;
        }

        addTagSection('Strengths', positiveTags, [16, 185, 129]);
        addTagSection('Areas for Improvement', negativeTags, [239, 68, 68]);

        const reviews = [
            { title: '👔 Hiring Manager', content: result.hiring_manager_review },
            { title: '💻 Principal Engineer', content: result.principal_engineer_review },
            { title: '📋 Recruiter', content: result.recruiter_review },
            { title: '🎯 Career Coach', content: result.career_coach_review },
        ];

        reviews.forEach(({ title, content }) => {
            if (y > 260) { doc.addPage(); y = 20; }

            doc.setFillColor(99, 102, 241);
            doc.rect(margin, y, 3, 12, 'F');
            doc.setTextColor(40, 40, 40);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(title, margin + 6, y + 8);
            y += 16;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(70, 70, 70);
            const lines = doc.splitTextToSize(stripHTML(content || ''), W - margin * 2);
            lines.forEach(line => {
                if (y > 275) { doc.addPage(); y = 20; }
                doc.text(line, margin, y);
                y += 5;
            });
            y += 6;
        });

        doc.setFillColor(99, 102, 241);
        doc.rect(0, 287, W, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('Generated by NovaReview — AI Resume & GitHub Analyser', margin, 293);

        doc.save('NovaReview_Report.pdf');
    }

});