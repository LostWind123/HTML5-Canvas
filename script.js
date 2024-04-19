document.addEventListener('DOMContentLoaded', function () {
    let v = document.querySelector("video");
    let c = document.querySelector("canvas");
    let ctx = c.getContext("2d");
    let i;
    const w = 320; // Set canvas width
    let vHeight; // Variable to store video height

    function draw() {
        let times = v.videoWidth / w;
        vHeight = v.videoHeight / times;
        c.width = w;
        c.height = vHeight;
        // Get the current video frame
        ctx.drawImage(v, 0, 0, w, vHeight);
        // Apply edge detection effect
        drawEdges();
        // Request next frame
        i = window.requestAnimationFrame(draw);
    }

    function drawEdges() {
        // Convert video frame to grayscale and apply edge detection
        let imageData = ctx.getImageData(0, 0, w, vHeight);
        let data = imageData.data;
        let grayBuffer = new Uint8Array(vHeight * w);

        // Convert to grayscale
        for (let i = 0, j = 0; i < data.length; i += 4, j++) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            grayBuffer[j] = avg;
        }

        // Apply edge detection (simple gradient-based method)
        for (let i = 0, j = 0; i < grayBuffer.length; i++) {
            let gx = grayBuffer[i + 1] - grayBuffer[i - 1];
            let gy = grayBuffer[i + w] - grayBuffer[i - w];
            let gradient = Math.sqrt(gx * gx + gy * gy);
            data[j++] = gradient;
            data[j++] = gradient;
            data[j++] = gradient;
            data[j++] = 255;
        }

        // Draw edge-detected image to canvas
        ctx.putImageData(imageData, 0, 0);
    }

    v.addEventListener("loadeddata", function () {
        draw();
    }, false);

    v.addEventListener("play", function () {
        draw();
    }, false);

    v.addEventListener("pause", function () {
        window.cancelAnimationFrame(i);
        i = undefined;
    }, false);

    v.addEventListener("ended", function () {
        window.cancelAnimationFrame(i);
        i = undefined;
    }, false);
});
