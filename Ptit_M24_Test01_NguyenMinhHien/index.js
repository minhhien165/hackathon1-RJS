"use strict";
class FeedbackManager {
    constructor() {
        this.feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        this.renderFeedbacks();
    }
    saveToLocalStorage() {
        localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
    renderFeedbacks() {
        const feedbackList = document.getElementById('feedbacks');
        feedbackList.innerHTML = '';
        this.feedbacks.forEach(feedback => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="feedback-score">${feedback.score}</span>${feedback.text}
                          <span class="edit-feedback" data-id="${feedback.id}">&#9998;</span>
                          <span class="delete-feedback" data-id="${feedback.id}">&#10006;</span>`;
            feedbackList.appendChild(li);
            // Add event listeners for edit and delete buttons
            li.querySelector('.edit-feedback').addEventListener('click', () => {
                this.editFeedback(feedback.id);
            });
            li.querySelector('.delete-feedback').addEventListener('click', () => {
                this.confirmDelete(feedback.id);
            });
        });
    }
    addFeedback(score, text) {
        const newFeedback = {
            id: Date.now(),
            score,
            text
        };
        this.feedbacks.push(newFeedback);
        this.saveToLocalStorage();
        this.renderFeedbacks();
        this.resetForm(); // Reset form after adding new feedback
    }
    editFeedback(id) {
        const feedbackIndex = this.feedbacks.findIndex(f => f.id === id);
        if (feedbackIndex !== -1) {
            const feedback = this.feedbacks[feedbackIndex];
            const feedbackText = document.getElementById('feedbackText');
            feedbackText.value = feedback.text;
            document.querySelectorAll('.star').forEach(star => {
                if (star.dataset.score === String(feedback.score)) {
                    star.classList.add('selected');
                }
                else {
                    star.classList.remove('selected');
                }
            });
            const sendButton = document.getElementById('addFeedback');
            sendButton.innerText = 'Update'; // Change button text to "Update"
            sendButton.onclick = () => {
                const selectedStar = document.querySelector('.star.selected');
                const score = parseInt(selectedStar.dataset.score);
                const text = feedbackText.value.trim();
                if (!text) {
                    alert('Please enter feedback text.');
                    return;
                }
                this.updateFeedback(feedbackIndex, score, text);
                sendButton.innerText = 'Send'; // Reset button text to "Send"
                sendButton.onclick = () => {
                    const selectedStar = document.querySelector('.star.selected');
                    const score = parseInt(selectedStar.dataset.score);
                    const text = document.getElementById('feedbackText').value.trim();
                    if (!text) {
                        alert('Please enter feedback text.');
                        return;
                    }
                    this.addFeedback(score, text);
                    sendButton.innerText = 'Update'; // Reset button text to "Update"
                };
            };
        }
    }
    updateFeedback(index, score, text) {
        this.feedbacks[index].score = score;
        this.feedbacks[index].text = text;
        this.saveToLocalStorage();
        this.renderFeedbacks(); // Render updated feedback
        this.resetForm();
    }
    deleteFeedback(id) {
        this.feedbacks = this.feedbacks.filter(f => f.id !== id);
        this.saveToLocalStorage();
        this.renderFeedbacks();
    }
    confirmDelete(id) {
        const confirmation = confirm('Are you sure you want to delete this feedback?');
        if (confirmation) {
            this.deleteFeedback(id);
        }
    }
    resetForm() {
        document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
        document.getElementById('feedbackText').value = '';
    }
}
const feedbackManager = new FeedbackManager();
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
        star.classList.add('selected');
    });
});
document.getElementById('addFeedback').addEventListener('click', () => {
    const sendButton = document.getElementById('addFeedback');
    const buttonText = sendButton.innerText;
    if (buttonText === 'Send') {
        const selectedStar = document.querySelector('.star.selected');
        const score = parseInt(selectedStar.dataset.score);
        const text = document.getElementById('feedbackText').value.trim();
        if (!text) {
            alert('Please enter feedback text.');
            return;
        }
        feedbackManager.addFeedback(score, text);
    }
    else if (buttonText === 'Update') {
        const selectedStar = document.querySelector('.star.selected');
        const score = parseInt(selectedStar.dataset.score);
        const text = document.getElementById('feedbackText').value.trim();
        if (!text) {
            alert('Please enter feedback text.');
            return;
        }
        const feedbackId = parseInt(sendButton.dataset.feedbackId);
        feedbackManager.updateFeedback(feedbackId, score, text);
    }
});
