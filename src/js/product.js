import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ProductData('tents');
const product = new ProductDetails(productId, dataSource);

product.init();

const commentForm = document.querySelector('#comment-form');
const commentsList = document.querySelector('#comments-list');

const commentsKey = `product-comments-${productId}`;

function getComments() {
  const comments = localStorage.getItem(commentsKey);

  return comments ? JSON.parse(comments) : [];
}

function saveComments(comments) {
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function displayComments() {
  const comments = getComments();

  commentsList.innerHTML = '';

  if (comments.length === 0) {
    commentsList.innerHTML =
      '<p>No comments yet. Be the first to comment!</p>';
    return;
  }

  comments.forEach((comment) => {
    const commentArticle = document.createElement('article');
    commentArticle.classList.add('comment');

    const commentName = document.createElement('h3');
    commentName.textContent = comment.name;

    const commentText = document.createElement('p');
    commentText.textContent = comment.text;

    commentArticle.appendChild(commentName);
    commentArticle.appendChild(commentText);

    commentsList.appendChild(commentArticle);
  });
}

commentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = document.querySelector('#comment-name');
  const textInput = document.querySelector('#comment-text');

  const newComment = {
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
  };

  if (!newComment.name || !newComment.text) {
    return;
  }

  const comments = getComments();

  comments.push(newComment);

  saveComments(comments);

  displayComments();

  commentForm.reset();
});

displayComments();