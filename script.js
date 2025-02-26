require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' } });

require(["vs/editor/editor.main"], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: localStorage.getItem('code') || `<!DOCTYPE html>\n<html>\n<head>\n<title>Live Preview</title>\n<style>\nbody { font-family: Arial; }\n</style>\n</head>\n<body>\n<h1>Hello, World!</h1>\n<script>console.log('JS Working');<\/script>\n</body>\n</html>`,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true
    });

    function updatePreview() {
        const code = editor.getValue();
        localStorage.setItem('code', code);
        document.getElementById('preview').srcdoc = code;
    }

    function downloadCode() {
        const blob = new Blob([editor.getValue()], { type: 'text/html' });
        saveAs(blob, 'code.html');
    }

    editor.onDidChangeModelContent(updatePreview);
    updatePreview();
});

// Resizing the editor and preview
const resizer = document.getElementById("resizer");
const editorDiv = document.getElementById("editor-container");
const previewContainer = document.getElementById("preview-container");
let isResizing = false;

resizer.addEventListener("mousedown", (event) => {
    isResizing = true;
    document.addEventListener("mousemove", resizeEditor);
    document.addEventListener("mouseup", () => { isResizing = false; document.removeEventListener("mousemove", resizeEditor); });
});

function resizeEditor(event) {
    if (isResizing) {
        const newEditorWidth = event.clientX / window.innerWidth * 100;
        editorDiv.style.width = `${newEditorWidth}%`;
        previewContainer.style.width = `${100 - newEditorWidth}%`;
    }
}

// Status Bar Update
const statusBar = document.getElementById('status-bar');
document.addEventListener('keydown', () => {
    let cursor = editor.getPosition();
    statusBar.textContent = `Ln ${cursor.lineNumber}, Col ${cursor.column}`;
});
