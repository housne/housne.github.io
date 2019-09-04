(function() {
  function submitComment(url, formData) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formatFormDataToRequestBody(formData)
    }).then(res => {
      if (res.ok) return res.json()
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
  const form = document.getElementById('comment_form');
  const url = form.getAttribute('action')
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formDate = new FormData(form);
    submitComment(url, formDate).then(() => {
      alert('发表成功，请等待审核');
    }).catch(() => {
      alert('发表失败');
    });
  })
})()