// -------------------------------------------
// PREVENT SCROLL ISSUES ON PAGE LOAD
// -------------------------------------------
// Prevent scroll restoration and force top position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Force scroll to top immediately (before any content loads)
window.scrollTo(0, 0);


// -------------------------------------------
// HEXAGON SYSTEM
// -------------------------------------------
const svg = document.querySelector('.hexagon-container');
const hexagonSize = 80;
const innerHexSize = 40;

// Perfect hexagon geometry
function createHexagonPoints(cx, cy, size) {
    let points = [];
    for (let i = 0; i < 6; i++) {
        let angle = (Math.PI / 3) * i;
        let x = cx + size * Math.cos(angle);
        let y = cy + size * Math.sin(angle);
        points.push(`${x},${y}`);
    }
    return points.join(" ");
}

// Create complete hexagon group
function createHexagonWithInner(cx, cy, outerSize, innerSize, includeLines = true) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("hexagon");

    // Outer Hexagon
    const outer = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    outer.setAttribute("points", createHexagonPoints(cx, cy, outerSize));
    g.appendChild(outer);

    if (includeLines) {
        // Inner Hexagon
        const inner = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        inner.setAttribute("points", createHexagonPoints(cx, cy, innerSize));
        inner.classList.add("hexagon-inner");
        g.appendChild(inner);

        // Spokes (center → vertices)
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x2 = cx + outerSize * Math.cos(angle);
            const y2 = cy + outerSize * Math.sin(angle);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", cx);
            line.setAttribute("y1", cy);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.classList.add("hexagon-inner");
            g.appendChild(line);
        }

        // Across-hex lines (flat horizontal)
        for (let i = 0; i < 3; i++) {
            const a1 = (Math.PI / 3) * i;
            const a2 = a1 + Math.PI;

            const x1 = cx + outerSize * Math.cos(a1);
            const y1 = cy + outerSize * Math.sin(a1);
            const x2 = cx + outerSize * Math.cos(a2);
            const y2 = cy + outerSize * Math.sin(a2);

            const cross = document.createElementNS("http://www.w3.org/2000/svg", "line");
            cross.setAttribute("x1", x1);
            cross.setAttribute("y1", y1);
            cross.setAttribute("x2", x2);
            cross.setAttribute("y2", y2);
            cross.classList.add("hexagon-inner");
            g.appendChild(cross);
        }
    }
    return g;
}

// -------------------------------------------
// HEXAGON LAYOUT (fixed, clean, symmetric)
// -------------------------------------------
function generateHexagons() {
    svg.innerHTML = "";
    const width = window.innerWidth;
    const height = window.innerHeight;

    const topOffset = 20; // leave room for navbar

    const H = hexagonSize;
    const I = innerHexSize;

    // helper
    const add = (x, y, s, i, showInner = true) =>
        svg.appendChild(createHexagonWithInner(x, y, s, i, showInner));

    // -----------------------------
    // LEFT BLOCK (matches screenshot)
    // -----------------------------

    add(150, topOffset + 230, H, I);
    add(300, topOffset + 160, H, I);
    add(450, topOffset + 230, H, I);

    add(150, topOffset + 400, H, I);
    add(300, topOffset + 320, H, I);
    add(450, topOffset + 400, H, I);
    add(300, topOffset + 480, H, I);
    
    add(650, topOffset + 500, H, I);
    add(600, topOffset + 320, H, I);
    add(500, topOffset + 600, H *0.8, I *0.8);

    // -----------------------------
    // MID FADED HEXAGONS
    // -----------------------------
    add(width * 0.60, topOffset + 120, H * 0.7, I * 0.7 );
    add(width * 0.70, topOffset + 260, H * 0.7, I * 0.7);

    add(width * 0.57, topOffset + 420, H * 0.7, I * 0.7);
    add(width * 0.70, topOffset + 550, H * 0.7, I * 0.7);

    // -----------------------------
    // RIGHT BLOCK (big background hexagons)
    // -----------------------------
    add(width * 0.85, topOffset + 150, H * 1.0, I * 1.0);
    add(width * 0.93, topOffset + 350, H * 1.0, I * 1.0);
    add(width * 0.83, topOffset + 550, H * 1.0, I * 1.0);
}
generateHexagons();
// window.addEventListener('resize', generateHexagons);

// Smooth resize
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(generateHexagons, 300);
});


// // Scroll to upload section
// document.getElementById('slider').addEventListener('click', () => {
//     document.getElementById('main-ele').scrollIntoView({ behavior: 'smooth' });
// });

// File Upload Functionality
const fileInput = document.getElementById('file-input');
const uploadBox = document.getElementById('upload-box');
const imagePreview = document.getElementById('image-preview');
const scanContainer = document.getElementById('scan-container');
const scanButton = document.getElementById('scan-button');
const outputEle = document.getElementById('output-ele');
const progressContainer = document.getElementById('progress-container');

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            imagePreview.src = event.target.result;
            imagePreview.classList.add('show');
            uploadBox.style.display = 'none';
            scanContainer.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
});

// Drag and Drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});


// Scan Button Click
scanButton.addEventListener('click', function () {
    if (!fileInput.files[0]) {
        alert('Please select an image first!');
        return;
    }

    // Add loading state
    scanButton.classList.add('loading');
    scanButton.disabled = true;
    scanButton.innerHTML = '<i class="ri-loader-4-line"></i> Processing...';
    progressContainer.classList.add('show');

    // Simulate API call (replace with your actual API call)
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Replace this with your actual Flask endpoint
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Update results
            const resultText = document.getElementById('result-text');
            resultText.textContent = data.prediction || 'Unknown';
            
            if (data.prediction.includes('Tempered')) {
                resultText.classList.add('Tempered');
                console.log(data.prediction);
                document.getElementById('result-text').style.color="#ef4444";
            }

            document.getElementById('accuracy').textContent = (data.accuracy || '90'+ '%');
            document.getElementById('confidence').textContent = data.confidence || 'High';
            document.getElementById('train-accuracy').textContent = data.train_accuracy || '0.96';
            document.getElementById('val-accuracy').textContent = data.val_accuracy || '0.94';
            document.getElementById('train-loss').textContent = data.train_loss || '0.12';
            document.getElementById('val-loss').textContent = data.val_loss || '0.15';
            document.getElementById('image-details').textContent = data.image_details || 'No details available';

            // Update output image
            if (data.ela_image) {
                document.getElementById('output-image').src = data.ela_image;
            }

            // Show output section
            outputEle.classList.add('show');

            // Scroll to results
            setTimeout(() => {
                outputEle.scrollIntoView({ behavior: 'smooth' });
            }, 300);

            // Create chart if data available
            if (data.histogram) {
                createHistogram(data.histogram);
            }

            // Remove loading state
            scanButton.classList.remove('loading');
            scanButton.disabled = false;
            scanButton.innerHTML = '<i class="ri-refresh-line"></i> Scan Again';
            progressContainer.classList.remove('show');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during processing. Please try again.');
            scanButton.classList.remove('loading');
            scanButton.disabled = false;
            scanButton.innerHTML = '<i class="ri-scan-line"></i> Scan Image';
            progressContainer.classList.remove('show');
        });
});

// Create Histogram Chart
let histogramChart = null;
function createHistogram(data) {
    const canvas = document.getElementById("graph");
    if (!canvas) {
        console.error("Canvas with id 'graph' not found!");
        return;
    }
    const ctx = canvas.getContext("2d");
    if (histogramChart) {
        histogramChart.destroy();
    }
    histogramChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.labels || Array.from({ length: 256 }, (_, i) => i),
            datasets: [{
                label: "Pixel Intensity Distribution",
                data: data.values || [],
                backgroundColor: "rgba(74, 222, 128, 0.6)",
                borderColor: "rgba(74, 222, 128, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// Logo click effect
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scrolling for navigation buttons
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuIcon.classList.remove('active');
        }
    });
});

// Smooth scrolling for footer links
document.querySelectorAll('footer a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');

menuIcon.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
});

// Close menu when clicking overlay
menuOverlay.addEventListener('click', function () {
    menuIcon.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
});

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Scroll Reveal
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
});

// Scroll to top when button clicked
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// -------------------------------------------
// ENSURE TOP POSITION AFTER PAGE LOADS
// -------------------------------------------
window.addEventListener('load', function() {
    // Force scroll to top after all content loads
    window.scrollTo(0, 0);
});