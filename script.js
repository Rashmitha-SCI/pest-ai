const URL = "./model/";

let model, labelContainer, maxPredictions;

async function init() {
    console.log("Loading model...");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("Model loaded.");
}

document.getElementById("upload").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async function () {
            document.getElementById("preview").innerHTML = "";
            document.getElementById("preview").appendChild(img);

            if (!model) {
                try {
                    await init();
                } catch (err) {
                    console.error("Model failed to load:", err);
                    return;
                }
            }

            try {
                const prediction = await model.predict(img);
                prediction.sort((a, b) => b.probability - a.probability);
                const top = prediction[0];
                const percent = (top.probability * 100).toFixed(2);
                document.getElementById("prediction").innerText = `Detected: ${top.className} (${percent}%)`;
                console.log(`Prediction: ${top.className} - ${percent}%`);
            } catch (error) {
                console.error("Prediction error:", error);
            }
        };
    };
    reader.readAsDataURL(file);
});
