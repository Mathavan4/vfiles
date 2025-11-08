// ✅ Get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  } 
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

document.addEventListener("DOMContentLoaded", () => {
  const pdfInput = document.getElementById("pdfFile");
  const sigTypeRadios = document.querySelectorAll("input[name='sigType']");
  const textOptions = document.getElementById("textOptions");
  const imageOptions = document.getElementById("imageOptions");
  const signBtn = document.getElementById("signBtn");
  const loadingMsg = document.getElementById("loadingMsg");
  const pdfPreview = document.getElementById("pdfPreview");
  let signature = null;
  let position = { x: 50, y: 50 };
  let pdfDoc = null;

  // ✅ Switch between text and image signature
  sigTypeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "text") {
        textOptions.classList.remove("hidden");
        imageOptions.classList.add("hidden");
      } else {
        textOptions.classList.add("hidden");
        imageOptions.classList.remove("hidden");
      }
      updateSignature();
    });
  });

  // ✅ Load and preview PDF
  pdfInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      pdfDoc = await pdfjsLib.getDocument(typedarray).promise;
      pdfPreview.innerHTML = "";
      document.getElementById("previewTitle").classList.remove("hidden");

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        pdfPreview.appendChild(canvas);
      }
      updateSignature();
    };
    reader.readAsArrayBuffer(file);
  });

  // ✅ Create or update signature element
  function updateSignature() {
    if (signature) signature.remove();
    const sigType = document.querySelector("input[name='sigType']:checked").value;
    signature = document.createElement("div");
    signature.id = "signature";
    signature.style.position = "absolute";
    signature.style.left = position.x + "px";
    signature.style.top = position.y + "px";
    signature.style.cursor = "grab";
    signature.style.zIndex = 10;
    signature.style.touchAction = "none"; // Important for mobile drag

    if (sigType === "text") {
      const text = document.getElementById("sigText").value || "Signature";
      const fontSize = document.getElementById("fontSize").value;
      const fontFamily = document.getElementById("fontFamily").value;
      signature.textContent = text;
      signature.style.fontSize = fontSize + "px";
      signature.style.fontFamily = fontFamily;
      signature.style.color = "black";
      signature.style.background = "rgba(255,255,255,0.5)";
      signature.style.border = "1px dashed #0077cc";
      signature.style.padding = "4px 8px";
    } else {
      const file = document.getElementById("sigImage").files[0];
      if (file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.width = "150px";
        img.style.height = "50px";
        img.style.border = "1px dashed #0077cc";
        img.style.objectFit = "contain";
        signature.appendChild(img);
      }
    }

    pdfPreview.appendChild(signature);
    dragElement(signature);
  }

  // ✅ Universal drag function (works on desktop + mobile + tablet)
  function dragElement(el) {
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    el.addEventListener("pointerdown", startDrag);
    el.addEventListener("pointermove", onDrag);
    el.addEventListener("pointerup", stopDrag);
    el.addEventListener("pointercancel", stopDrag);

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      el.style.cursor = "grabbing";
    }

    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const parentRect = el.parentElement.getBoundingClientRect();
      const x = e.clientX - parentRect.left - offsetX;
      const y = e.clientY - parentRect.top - offsetY;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      position.x = x;
      position.y = y;
    }

    function stopDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
    }
  }

  // ✅ Update signature live when input changes
  ["sigText", "fontSize", "sigImage", "fontFamily"].forEach(id => {
    const el = document.getElementById(id);
    el && el.addEventListener("input", updateSignature);
    el && el.addEventListener("change", updateSignature);
  });

  // ✅ Sign PDF action
  signBtn.addEventListener("click", async () => {
    const pdf = pdfInput.files[0];
    if (!pdf) return alert("⚠️ Select a PDF first!");
    const sigType = document.querySelector("input[name='sigType']:checked").value;

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("sigType", sigType);
    formData.append("x", position.x);
    formData.append("y", position.y);
    formData.append("page", 0);
    if (sigType === "text") {
      formData.append("sigText", document.getElementById("sigText").value);
      formData.append("fontSize", document.getElementById("fontSize").value);
      formData.append("fontFamily", document.getElementById("fontFamily").value);
    } else {
      const sigImg = document.getElementById("sigImage").files[0];
      if (!sigImg) return alert("⚠️ Upload a signature image!");
      formData.append("sigImage", sigImg);
    }

    loadingMsg.classList.remove("hidden");
    try {
      const res = await fetch("/sign_pdf_action/", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData
      });
      if (!res.ok) throw new Error("Server error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "signed.pdf";
      a.click();
      loadingMsg.classList.add("hidden");
    } catch (err) {
      console.error(err);
      alert("⚠️ Signing failed! Try again.");
      loadingMsg.classList.add("hidden");
    }
  });
});
