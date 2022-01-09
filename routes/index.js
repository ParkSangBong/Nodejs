const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");

router.get("/", function (request, response) {
  //사실은 뒤의 콜백도 미들웨어인것. 익스프레스에선 모든게 미들웨어라고 볼 수도 있음.
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;" >
    `,
    `<a href="/topic/create">create</a>`
  );
  response.send(html);
});

module.exports = router;
