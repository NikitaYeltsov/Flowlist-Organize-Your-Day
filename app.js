(function () {
    'use strict';

    let docs = [];
    let activeId = null;
    let saveTimer = null;

    const STORE_KEY = 'flowlist_docs_v2';

    const docList = document.getElementById('docList');
    const editorTitle = document.getElementById('editorTitle');
    const editorBody = document.getElementById('editorBody');
    const breadcrumb = document.getElementById('breadcrumbTitle');
    const metaDate = document.getElementById('metaDate');
    const metaWords = document.getElementById('metaWords');
    const metaTasks = document.getElementById('metaTasks');
    const saveIndicator = document.getElementById('saveIndicator');
    const quickInput = document.getElementById('quickTaskInput');
    const quickBtn = document.getElementById('quickTaskBtn');
    const newDocBtn = document.getElementById('newDocBtn');
    const sidebarNewBtn = document.getElementById('sidebarNewBtn');
    const clearDocBtn = document.getElementById('clearDocBtn');
    const insertTaskBtn = document.getElementById('insertTaskBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const confettiLayer = document.getElementById('confettiLayer');
    const tbBtns = document.querySelectorAll('.tb-btn[data-cmd]');
    const headBtns = document.querySelectorAll('.tb-btn[data-heading]');

    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
    function now() { return Date.now(); }
    function fmtDate(ts) {
        return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    function countWords(el) {
        return (el.innerText || '').trim().split(/\s+/).filter(Boolean).length;
    }
    function countTasks(el) {
        return el.querySelectorAll('.task-row').length;
    }

    function load() {
        try { docs = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { docs = []; }
        if (!docs.length) docs = [createDoc('Welcome to Flowlist', defaultContent())];
    }
    function persist() {
        localStorage.setItem(STORE_KEY, JSON.stringify(docs));
        flashSaved();
    }
    function flashSaved() {
        saveIndicator.classList.add('saving');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => saveIndicator.classList.remove('saving'), 800);
    }
    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveActive, 600);
    }

    function createDoc(title, body) {
        return { id: uid(), title: title || 'Untitled', body: body || '', createdAt: now(), updatedAt: now() };
    }
    function defaultContent() {
        return `<h2>Getting started</h2>
<p>Welcome! This is your first document. You can write anything here — notes, ideas, plans.</p>
<p>Use the toolbar above to <b>format text</b>, add <em>headings</em>, bullet lists, or task checkboxes.</p>
<h3>Your tasks</h3>
<div class="task-row" data-task-id="t1"><div class="task-row-check"><svg class="task-row-check-icon" viewBox="0 0 24 24" fill="none" stroke="#faf7f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><div class="task-row-text" contenteditable="true" spellcheck="true">Try clicking this checkbox</div><button class="task-row-del" title="Remove">✕</button></div>
<div class="task-row" data-task-id="t2"><div class="task-row-check"><svg class="task-row-check-icon" viewBox="0 0 24 24" fill="none" stroke="#faf7f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><div class="task-row-text" contenteditable="true" spellcheck="true">Add a new task using the bar at the bottom</div><button class="task-row-del" title="Remove">✕</button></div>
<div class="task-row" data-task-id="t3"><div class="task-row-check"><svg class="task-row-check-icon" viewBox="0 0 24 24" fill="none" stroke="#faf7f1" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><div class="task-row-text" contenteditable="true" spellcheck="true">Create a new document with the sidebar</div><button class="task-row-del" title="Remove">✕</button></div>`;
    }
    function getActive() { return docs.find(d => d.id === activeId); }

    function saveActive() {
        const doc = getActive();
        if (!doc) return;
        doc.title = editorTitle.value.trim() || 'Untitled';
        doc.body = editorBody.innerHTML;
        doc.updatedAt = now();
        persist();
        renderDocList();
        updateMeta();
        breadcrumb.textContent = doc.title;
    }

    function openDoc(id) {
        saveActive();
        activeId = id;
        const doc = getActive();
        if (!doc) return;

        editorTitle.value = doc.title === 'Untitled' ? '' : doc.title;
        editorBody.innerHTML = doc.body;
        breadcrumb.textContent = doc.title;
        metaDate.textContent = fmtDate(doc.updatedAt);

        bindTaskEvents();
        updateMeta();
        renderDocList();

        const page = document.querySelector('.editor-page');
        if (page) { page.style.animation = 'none'; void page.offsetWidth; page.style.animation = ''; }

        closeSidebar();
        editorTitle.focus();
    }

    function newDoc() {
        const doc = createDoc('Untitled', '');
        docs.unshift(doc);
        persist();
        openDoc(doc.id);
        editorTitle.value = '';
        editorTitle.focus();
    }

    function deleteDoc(id) {
        if (docs.length <= 1) { alert('You need at least one document.'); return; }
        if (!confirm('Delete this document?')) return;
        docs = docs.filter(d => d.id !== id);
        persist();
        if (activeId === id) openDoc(docs[0].id);
        else renderDocList();
    }

    function renderDocList() {
        docList.innerHTML = '';
        docs.forEach((doc, i) => {
            const li = document.createElement('li');
            li.className = 'doc-item' + (doc.id === activeId ? ' active' : '');
            li.style.animationDelay = (i * 0.04) + 's';
            li.innerHTML = `
        <span class="doc-item-icon">◈</span>
        <div class="doc-item-body">
          <div class="doc-item-title">${esc(doc.title)}</div>
          <div class="doc-item-date">${fmtDate(doc.updatedAt)}</div>
        </div>
        <button class="doc-item-del" data-id="${doc.id}" title="Delete">✕</button>
      `;
            li.addEventListener('click', (e) => {
                if (e.target.closest('.doc-item-del')) return;
                if (doc.id !== activeId) openDoc(doc.id);
            });
            li.querySelector('.doc-item-del').addEventListener('click', () => deleteDoc(doc.id));
            docList.appendChild(li);
        });
    }

    function updateMeta() {
        const w = countWords(editorBody);
        const t = countTasks(editorBody);
        metaWords.textContent = w + (w === 1 ? ' word' : ' words');
        metaTasks.textContent = t + (t === 1 ? ' task' : ' tasks');
        const doc = getActive();
        if (doc) metaDate.textContent = fmtDate(doc.updatedAt);
    }

    tbBtns.forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const cmd = btn.dataset.cmd;
            const val = btn.dataset.val || null;
            document.execCommand(cmd, false, val);
            editorBody.focus();
            updateToolbarState();
        });
    });

    headBtns.forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.execCommand('formatBlock', false, btn.dataset.heading);
            editorBody.focus();
            updateToolbarState();
        });
    });

    function updateToolbarState() {
        const cmds = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter'];
        cmds.forEach(cmd => {
            const btn = document.querySelector(`.tb-btn[data-cmd="${cmd}"]`);
            if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
        });
    }

    editorBody.addEventListener('keyup', updateToolbarState);
    editorBody.addEventListener('mouseup', updateToolbarState);

    clearDocBtn.addEventListener('click', () => {
        if (!confirm('Clear all content in this document?')) return;
        editorBody.innerHTML = '';
        editorTitle.value = '';
        scheduleSave();
    });

    insertTaskBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        insertTaskRow('');
        editorBody.focus();
    });

    quickBtn.addEventListener('click', () => quickAddTask());
    quickInput.addEventListener('keydown', e => { if (e.key === 'Enter') quickAddTask(); });

    function quickAddTask() {
        const text = quickInput.value.trim();
        if (!text) { shakeEl(quickInput); return; }
        insertTaskRow(text);
        quickInput.value = '';
        scheduleSave();
        updateMeta();
    }

    function insertTaskRow(text) {
        const id = uid();
        const row = buildTaskRow(id, text, false);
        editorBody.appendChild(row);

        const textEl = row.querySelector('.task-row-text');
        if (textEl) {
            textEl.focus();
            placeCaretAtEnd(textEl);
        }
        scheduleAndMeta();
    }

    function buildTaskRow(id, text, done) {
        const div = document.createElement('div');
        div.className = 'task-row' + (done ? ' task-done' : '');
        div.dataset.taskId = id;
        div.innerHTML = `
      <div class="task-row-check">
        <svg class="task-row-check-icon" viewBox="0 0 24 24" fill="none" stroke="#faf7f1" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="task-row-text" contenteditable="true" spellcheck="true">${esc(text)}</div>
      <button class="task-row-del" title="Remove task">✕</button>
    `;
        bindTaskRow(div);
        return div;
    }

    function bindTaskRow(row) {
        const check = row.querySelector('.task-row-check');
        const delBtn = row.querySelector('.task-row-del');
        const text = row.querySelector('.task-row-text');

        check.addEventListener('click', () => {
            row.classList.toggle('task-done');
            if (row.classList.contains('task-done')) confetti();
            scheduleSave();
        });

        delBtn.addEventListener('click', () => {
            row.style.transition = 'opacity .25s, transform .25s';
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';
            setTimeout(() => { row.remove(); scheduleAndMeta(); }, 260);
        });

        text.addEventListener('input', scheduleSave);

        text.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const newRow = buildTaskRow(uid(), '', false);
                row.insertAdjacentElement('afterend', newRow);
                newRow.querySelector('.task-row-text').focus();
                scheduleSave();
            }
            if (e.key === 'Backspace' && text.innerText.trim() === '') {
                e.preventDefault();
                const prev = row.previousElementSibling;
                row.remove();
                if (prev) {
                    const prevText = prev.querySelector('.task-row-text');
                    if (prevText) { prevText.focus(); placeCaretAtEnd(prevText); }
                    else { prev.focus(); }
                }
                scheduleSave();
                updateMeta();
            }
        });
    }

    function bindTaskEvents() {
        editorBody.querySelectorAll('.task-row').forEach(row => bindTaskRow(row));
    }

    editorBody.addEventListener('input', scheduleAndMeta);
    editorTitle.addEventListener('input', () => {
        breadcrumb.textContent = editorTitle.value.trim() || 'Untitled';
        scheduleSave();
    });

    function scheduleAndMeta() { scheduleSave(); updateMeta(); }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveActive(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); newDoc(); }
    });

    function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('visible'); }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); }

    if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);

    newDocBtn.addEventListener('click', newDoc);
    sidebarNewBtn.addEventListener('click', newDoc);

    const colors = ['#c9a84c', '#8fa870', '#b85c38', '#3d4a2e', '#e8cc80', '#4e5f3a', '#d4b89a'];
    function confetti() {
        const cx = window.innerWidth / 2;
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            const sz = 6 + Math.random() * 8;
            el.style.cssText = `
        left:${cx + (Math.random() - .5) * 320}px;
        top:${80 + Math.random() * 60}px;
        width:${sz}px; height:${sz}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        transform:rotate(${Math.random() * 360}deg);
        animation-duration:${.8 + Math.random() * .5}s;
        animation-delay:${Math.random() * .1}s;
      `;
            confettiLayer.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function placeCaretAtEnd(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    function shakeEl(el) {
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const t = ts - start;
            el.style.transform = `translateX(${Math.sin(t / 35) * 7 * Math.max(0, 1 - t / 280)}px)`;
            if (t < 300) requestAnimationFrame(step);
            else el.style.transform = '';
        };
        requestAnimationFrame(step);
    }

    load();
    renderDocList();
    if (docs.length) openDoc(docs[0].id);

})();