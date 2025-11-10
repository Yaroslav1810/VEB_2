<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<jsp:useBean id="results" class="web.beans.ResultsBean" scope="session" />
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Результат</title>
  <link rel="stylesheet" href="<c:url value='/static/styles.css'/>">
</head>
<body>
<main class="container card">
        <table>
            <thead>
                <tr><th>X</th><th>Y</th><th>R</th><th>Попадание</th><th>Время</th></tr>
            </thead>
            <tbody>
                <tr><td>${res.x}</td><td>${res.y}</td><td>${res.r}</td><td>${res.hit ? 'Да' : 'Нет'}</td><td>${res.time}</td></tr>
            </tbody>
        </table>
    <form action="<c:url value='/controller'/>" method="get" style="margin-top:16px">
        <button type="submit">Вернуться на главную</button>
    </form>
</main>
</body>
</html>
