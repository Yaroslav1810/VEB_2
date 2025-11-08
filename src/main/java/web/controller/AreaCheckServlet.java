package web.controller;

import jakarta.inject.Inject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import web.beans.ResultsBean;
import web.model.HitResult;

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
        if (!checkRange(x, y, r)) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "x, y or r is not in correct range");
            return;
        }
        HttpSession session = req.getSession(true);
        ResultsBean results = (ResultsBean) session.getAttribute("results");
        if (results == null) {
            results = new ResultsBean();
            session.setAttribute("results", results);
        }
        double X = Double.parseDouble(parseNum(x));
        double Y = Double.parseDouble(parseNum(y));
        double R = Double.parseDouble(parseNum(r));

        HitResult newItem = new HitResult(X, Y, R, isHit(X,Y,R), System.nanoTime() - t0);
        results.add(newItem);
        boolean ajax = "XMLHttpRequest".equalsIgnoreCase(req.getHeader("X-Requested-With"));

        if (Objects.equals(req.getParameter("response"), "string")) {
            req.getSession(true).setAttribute("lastItem", newItem);
            resp.sendRedirect(req.getContextPath() + "/string.jsp");
            return;
        }
        String historyJson = new com.google.gson.Gson()
                .toJson(results.getData());
        req.setAttribute("historyJson", historyJson);

        req.getRequestDispatcher("/result.jsp").forward(req, resp);

    }


    private static boolean checkRange(String x, String y, String r) {
        try {
            double dx = Double.parseDouble(parseNum(x));
            double dy = Double.parseDouble(parseNum(y));
            int dr = Integer.parseInt(parseNum(r));

            if (!(dx >= -5 && dx <= 3)) {
                return false;
            } else if (!(dy >= -3 && dy <= 5)) {
                return false;
            } else return dr >= 1 && dr <= 5;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private static String parseNum(String s) {
        return s.replace(',', '.').trim();
    }

    private static boolean isHit(double x, double y, double r) {
        double X = (7.0 * x) / r;
        double Y = (6.0 * y) / r;
        return (Y <= yTop(X)) && (Y >= yBottom(X));

    }

    private static double yTop(double x) {
        double a = Math.abs(x);
        if (a < 0.5) {
            return 2.25;
        } else if (a < 0.75) {
            return 3 * a + 0.75;
        } else if (a < 1) {
            return 9 - 8 * a;
        } else if (a < 3) {
            return 1.5 - 0.5 * a - (3 * Math.sqrt(10) / 7) * (Math.sqrt(3 - a * a + 2 * a) - 2);
        } else {
            return 3 * Math.sqrt(1 - Math.pow((a / 7), 2));
        }
    }

    private static double yBottom(double x) {
        double a = Math.abs(x);
        if (a < 4) {
            return a / 2 - ((3 * Math.sqrt(33) - 7) / 112) * a * a + Math.sqrt(1 - Math.pow(Math.abs(a - 2) - 1, 2)) - 3;
        } else {
            return -3 * Math.sqrt(-Math.pow((a / 7), 2) + 1);
        }
    }


}

