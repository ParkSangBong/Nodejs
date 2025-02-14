const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const template = require("../lib/template.js");
const sanitizeHtml = require("sanitize-html");

router.get("/create", function (request, response) {
  const title = "WEB - create";
  const list = template.list(request.list);
  const html = template.HTML(
    title,
    list,
    `
          <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
    ""
  );
  response.send(html);
});

router.post("/create_process", function (request, response) {
  console.log("request.list : ", request.list);
  const post = request.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", function (err) {
    // response.writeHead(302, { Location: `/?id=${title}` });
    // response.end();
    response.redirect(`/topic/${title}`);
  });
});

router.get("/update/:pageId", (request, response) => {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(
      title,
      list,
      `
            <form action="/topic/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
      `<a href="/topic/create">create</a> <a href="/topic/update?/${title}">update</a>`
    );
    response.send(html);
  });
});

router.post("/update_process", (request, response) => {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, "utf8", function (err) {
      // response.writeHead(302, { Location: `/?id=${title}` });
      // response.end();
      response.redirect(`/topic/${title}`);
    });
  });
});

router.get("/:pageId", function (request, response, next) {
  // return res.send("/page");
  console.log(request.list);

  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    if (err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ["h1"],
      });
      var list = template.list(request.list);
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    }
  });
});

router.post("/delete_process", (request, response) => {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    response.redirect("/");
  });
});

module.exports = router;
