document.getElementById('getResult').addEventListener('click', function() {

    const geminiAPIkey = "AIzaSyDxoKMt0H3CvV7QS2IByPtP14zUXCr6gtI"; 
    const geminiAIModel = "gemini-1.5-flash"; 
    const imageInput = document.getElementById('image');
    const details = document.getElementById('details').value;
    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');

    if (imageInput.files.length === 0 || details.trim() === "") {
        alert('Please upload the image properly');
        return;
    }

    const imageFile = imageInput.files[0];
    const reader = new FileReader();
    
    reader.readAsDataURL(imageFile);

    reader.onloadend = function() {
        const base64Image = reader.result.split(',')[1]; 
        const imageType = imageFile.type;

        const data = {
            "contents": [
                {
                    "parts": [
                        {"text": details},
                        {
                            "inlineData": {
                                "mimeType": imageType,
                                "data": base64Image
                            }
                        }
                    ]
                }
            ],
            "safetySettings": [
                { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
            ]
        };

        spinner.style.display = 'block';
        resultDiv.innerText = '';

        fetch('https://generativelanguage.googleapis.com/v1beta/models/' + geminiAIModel + ':generateContent?key=' + geminiAPIkey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('API Response:', result);
            const textContent = result.candidates[0].content.parts[0].text;

            resultDiv.innerText = textContent;
            spinner.style.display = 'none';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error:', error);

            spinner.style.display = 'none';
            resultDiv.innerText = 'Error: ' + error;
        });
    };
});

// GSAP Animation for main content 
gsap.to("main", { opacity: 1, duration: 1, ease: "power2.out" });

document.getElementById('image').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Show the image
            
            // Animate the image preview container
            imagePreviewContainer.style.display = 'block'; // Show the container
            gsap.fromTo(imagePreviewContainer, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
            
            // Animate the image itself
            gsap.fromTo(imagePreview, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('getResult').addEventListener('click', function() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerText = ''; // Clear previous results
    resultDiv.style.opacity = 0; // Reset opacity for fade-in animation
    
    // Show loading spinner
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

    // Simulate evaluation process
    setTimeout(() => {
        spinner.style.display = 'none'; // Hide spinner after evaluation
        resultDiv.innerText = 'Evaluation completed!'; // Update result after some time
        
        // Animate result display
        gsap.fromTo(resultDiv, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }, 2000); // Simulated delay for evaluation
});

document.getElementById('details').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior of newline insertion
        document.getElementById('getResult').click(); // Simulate clicking the "Evaluate" button
    }
});