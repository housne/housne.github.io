(function() {
  initAuthData();
  const form = document.getElementById('comment_form');
  const url = form.getAttribute('action');
  const submitButton = document.getElementById('submit_btn');
  let submitProcessing = false;
  form.addEventListener('submit', (e) => {
    if (submitProcessing) {
      return;
    }
    e.preventDefault();
    const formDate = new FormData(form);
    submitProcessing = true;
    submitButton.innerText = '提交中...';
    submitButton.setAttribute('disabled', true);
    submitComment(url, formDate).then(() => {
      document.getElementById('comment_textarea').value = '';
      const isReply = document.getElementById('parent_input').value !== '';
      if (isReply) {
        toggleReply();
      }
      alert('发表成功，请等待审核');
    }).catch(() => {
      alert('发表失败');
    }).finally(() => {
      submitButton.innerText = '提交';
      submitButton.removeAttribute('disabled');
      submitProcessing = false;
    })
  });
  const commentList = document.getElementById('comment_list');
  commentList.addEventListener('click', function(e) {
    const target = e.target;
    if (!target.classList.contains('reply-button')) {
      return;
    }
    toggleReply(target);
  })

  document.getElementById('cancel_reply_button').addEventListener('click', function() {
    toggleReply();
  });

  function saveAuthorData(name, email, url) {
    localStorage.setItem('authorData', JSON.stringify({ name, email, url }));
  }

  function parseAuthorData() {
    let authorData = localStorage.getItem('authorData');
    if (!authorData) {
      return;
    }
    try {
      authorData = JSON.parse(authorData);
    } catch {
      return;
    }
    return authorData;
  }

  function initAuthData() {
    const authData = parseAuthorData();
    if (!authData) {
      return;
    }
    const nameInput = document.getElementById('comment_name_input');
    const emailInput = document.getElementById('comment_email_input');
    const urlInput = document.getElementById('comment_url_input');
    if (authData.name) {
      nameInput.value = authData.name;
    }
    if (authData.email) {
      emailInput.value = authData.email;
    }
    if (authData.url) {
      urlInput.value = authData.url;
    }
  }

  function submitComment(url, formData) {
    const body = formatFormDataToRequestBody(formData);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    }).then(res => {
      if (res.ok) {
        const name = formData.get('fields[name]');
        const email = formData.get('fields[email]');
        const url = formData.get('fields[url]');
        saveAuthorData(name, email, url);
        return res.json()
      }
      throw new Error(res.statusText)
    });
  }

  function formatFormDataToRequestBody(formData) {
    const body = [];
    for (const [key, value] of formData.entries()) {
      body.push(`${fixedEncodeURIComponent(key)}=${fixedEncodeURIComponent(value)}`)
    }
    return body.join("&");
  }

  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  function toggleReply(replyTargetEl) {
    const commentFormTitle = document.getElementById('comment_form_title');
    const parentInput = document.getElementById('parent_input');
    const form = document.getElementById('comment_form_box');
    if (replyTargetEl) {
      const replyContainerEL = replyTargetEl.closest('.comment-content');
      if (!replyContainerEL) {
        throw new Error("wrong DOM structure");
      }
      const author = replyTargetEl.dataset.author;
      const id = replyTargetEl.dataset.id;
      parentInput.value = id;
      commentFormTitle.innerText = `回复 ${author}`;
      form.classList.add('is-reply');
      replyContainerEL.appendChild(form);
      document.getElementById('comment_textarea').focus();
    } else {
      parentInput.value = '';
      commentFormTitle.innerText = `添加评论`;
      form.classList.remove('is-reply');
      document.getElementById('comment_form_container').appendChild(form);
    }
  }
  
})()