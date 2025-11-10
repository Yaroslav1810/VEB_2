package web.controller;

import jakarta.inject.Inject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import web.beans.ResultsBean;
import web.model.*;

import java.io.IOException;
import java.util.Objects;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=UTF-8");
        resp.setHeader("Cache-Control", "no-store");
        long t0 = System.nanoTime();
        String x = req.getParameter("x");
        String y = req.getParameter("y");
        String r = req.getParameter("r");

        if (x == null || y == null || r == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "x, y or r is null");
            return;
        }
        if (!CheckRange.check(x, y, r)) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "x, y or r is not in correct range");
            return;
        }
        HttpSession session = req.getSession(true);
        ResultsBean results = (ResultsBean) session.getAttribute("results");
        if (results == null) {
            results = new ResultsBean();
            session.setAttribute("results", results);
        }
        double X = Double.parseDouble(ParseNum.parse(x));
        double Y = Double.parseDouble(ParseNum.parse(y));
        double R = Double.parseDouble(ParseNum.parse(r));

        HitResult newItem = new HitResult(X, Y, R, IsHit.hit(X,Y,R), System.nanoTime() - t0);
        results.add(newItem);
        boolean ajax = "XMLHttpRequest".equalsIgnoreCase(req.getHeader("X-Requested-With"));

        if (Objects.equals(req.getParameter("response"), "string")) {
            session.setAttribute("res", newItem);
            resp.sendRedirect(req.getContextPath() + "/string.jsp");
            return;
        }
        String historyJson = new com.google.gson.Gson()
                .toJson(results.getData());
        req.setAttribute("historyJson", historyJson);

        req.getRequestDispatcher("/result.jsp").forward(req, resp);

    }
}

