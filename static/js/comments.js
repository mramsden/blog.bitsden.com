class CommentsService {
    constructor(options) {
        this.target = options.target;
        this.baseUrl = options.baseUrl || 'https://comments.bitsden.com/api/v1';
        this.comments = [];
        this.listeners = new Set();
    }

    addListener(listener) {
        this.listeners.add(listener);
    }

    removeListener(listener) {
        this.listeners.remove(listener);
    }

    postComment(author, content) {
        this._createComment(author, content)
            .then(() => this._fetchComments())
            .then(comments => {
                this.comments = comments;
                this._notifyListeners();
            });
    }

    refreshComments() {
        this._fetchComments().then(comments => {
            this.comments = comments;
            this._notifyListeners();
        });
    }

    async _fetchComments() {
        const url = new URL(`${this.baseUrl}/comments`);
        url.searchParams.set('target', target);
        try {
            const response = await fetch({ method: 'get', url: url.toString() });
            return response.json();
        } catch (err) {
            console.info(`Failed to load comments: ${err}`);
            return this.comments;
        }
    }

    async _createComment(author, content) {
        const { target } = this;
        const headers = new Headers();
        headers.set('content-type', 'application/json');
        const response = await fetch({
            method: 'post',
            url: `${this.baseUrl}/comments`,
            headers,
            body: JSON.stringify({ author, content, target })
        });
        return response.status === 204;
    }

    _notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.comments);
        }
    }
}

const { location } = window;
const target = [location.protocol, '//', location.host, location.pathname].join('');
const comments = new CommentsService({ target });

class CommentsElement extends HTMLDivElement {
    constructor() {
        super();
        this._createCommentsContent();
    }

    _createCommentsContent() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('comments');
        const commentForm = this._createCommentForm();
        this.appendChild(wrapper);
        wrapper.appendChild(commentForm);
    }

    _createCommentForm() {
        const form = document.createElement('form');

        let formRow = document.createElement('div');
        const authorLabel = document.createElement('label');
        authorLabel.innerText = 'Author';
        authorLabel.htmlFor = 'author';
        const authorInput = document.createElement('input');
        authorInput.id = 'author';
        authorInput.type = 'text';
        formRow.appendChild(authorLabel);
        formRow.appendChild(authorInput);
        form.appendChild(formRow);

        formRow = document.createElement('div');
        const commentLabel = document.createElement('comment');
        commentLabel.innerText = 'Comment';
        commentLabel.htmlFor = 'content';
        const commentInput = document.createElement('textarea');
        commentInput.id = 'content';
        formRow.appendChild(commentLabel);
        formRow.appendChild(commentInput);
        form.appendChild(formRow);

        return form;
    }
}

customElements.define('bitsden-comments', CommentsElement, { extends: 'div' });
