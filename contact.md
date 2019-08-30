---
title: "联系"
date: 2019-08-10T23:19:14+08:00
layout: page
slug: /contact
menu: "main"
order: 2
---

<form action="https://submit-form.com/kkEtjNAhVF5xsroQMA7Tv" target="_self" method="POST" id="contact_form">
    <input type="text" class="form-control" name="name" placeholder="称呼">
    <input type="email" class="form-control" name="email" placeholder="邮箱">
    <textarea name="message" class="form-control" placeholder="信息" rows="8"></textarea>
    <button type="submit" class="btn" id="submit_button">发送</button>
</form>
<script>
  (function(){
    document.getElementById('contact_form').addEventListener('submit', function(e) {
      e.preventDefault();
      const formEl = e.target;
      let data = {};
      const form = new FormData(formEl);
      const submitButton = document.getElementById('submit_button');
      for (const [key, value] of form) {
        data[key] = value;
      }
      submitButton.innerText = '发送中';
      fetch(formEl.action, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        alert('提交成功');
        formEl.reset();
      })
      .catch(() => alert('提交失败'))
      .finally(() => (submitButton.innerText = '发送'))
    })
  })();
</script>