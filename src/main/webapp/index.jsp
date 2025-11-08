<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ЛР: Попадание точки 2</title>
  <link rel="stylesheet" href="<c:url value='/static/styles.css'/>">
</head>
<body>
<header class="topbar">
  <div class="container">
    <h1>Бобровский Ярослав — P3220 — Вариант 35890</h1>
  </div>
</header>

<main class="container grid">
  <section class="card">
    <h2>Форма ввода</h2>
    <form id="hit-form" method="get" action="<c:url value='/controller'/>" autocomplete="off">
      <div class="row">
        <span class="lbl">X:</span>
        <div class="choices" id="x-group" data-name="x">
          <span id="x-display">—</span>
          <input type="hidden" name="x" id="x-hidden" value="">
          <button type="button" class="x-btn" value="-5">-5</button>
          <button type="button" class="x-btn" value="-4">-4</button>
          <button type="button" class="x-btn" value="-3">-3</button>
          <button type="button" class="x-btn" value="-2">-2</button>
          <button type="button" class="x-btn" value="-1">-1</button>
          <button type="button" class="x-btn" value="0">0</button>
          <button type="button" class="x-btn" value="1">1</button>
          <button type="button" class="x-btn" value="2">2</button>
          <button type="button" class="x-btn" value="3">3</button>
        </div>
      </div>

      <div class="row">
        <label for="y" class="lbl">Y:</label>
        <input id="y" name="y" type="number" inputmode="decimal" step="any"
               min="-3" max="5" required placeholder="-3…5" />
      </div>

      <div class="row">
        <span class="lbl">R:</span>
        <div class="choices" id="r-group">
          <label><input type="radio" name="r" value="1">1</label>
          <label><input type="radio" name="r" value="2">2</label>
          <label><input type="radio" name="r" value="3">3</label>
          <label><input type="radio" name="r" value="4">4</label>
          <label><input type="radio" name="r" value="5">5</label>
        </div>
      </div>

      <div class="row">
        <button type="submit" id="submit-btn" formaction="<c:url value='/controller?response=string'/>">Проверить</button>
        <button type="button" id="clear-btn">Очистить историю</button>
        <span id="err" class="error"></span>
      </div>
    </form>

    <h3>Ответ сервера</h3>
    <div class="server-view">
    <table id="history" class="table">
      <thead>
      <tr><th>X</th><th>Y</th><th>R</th><th>Попадание</th><th>Время</th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <p id="empty-note" style="display:none">Пока нет данных.</p>
    <div id="ajax-box" hidden></div>
    </div>
  </section>

  <section class="card">
    <h2>График</h2>
    <canvas id="plot" width="520" height="520"></canvas>
  </section>
</main>


<script defer src="<c:url value='/static/app.js'/>"></script>
</body>
</html>
