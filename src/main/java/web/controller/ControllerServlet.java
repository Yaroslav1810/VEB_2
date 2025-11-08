package web.controller;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import web.beans.ResultsBean;

import java.io.IOException;
import java.util.List;


@WebServlet(name = "ControllerServlet", urlPatterns = {"/controller"})
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if("clear".equals(req.getParameter("action"))) {

            HttpSession session = req.getSession(false);
            ResultsBean results = null;
            if (session != null) {
                results = (ResultsBean) session.getAttribute("results");
                if (results != null) {
                    results.clear();
                }
            }

            String historyJson = new Gson().toJson(
                    (results == null) ? List.of() : results.getData()
            );
            req.setAttribute("historyJson", historyJson);

            req.getRequestDispatcher("/result.jsp").forward(req, resp);
            return;
        }
        else if("history".equals(req.getParameter("action"))) {

            HttpSession session = req.getSession(false);
            ResultsBean results = null;
            if (session != null) {
                results = (ResultsBean) session.getAttribute("results");
            }

            String historyJson = new Gson().toJson(
                    (results == null) ? List.of() : results.getData()
            );
            req.setAttribute("historyJson", historyJson);

            req.getRequestDispatcher("/result.jsp").forward(req, resp);
            return;
        }
        else if(req.getParameter("x")==null || req.getParameter("y")==null || req.getParameter("r")==null){
            req.getRequestDispatcher("/index.jsp").forward(req, resp);
        }

        else{
            req.getRequestDispatcher("/area-check").forward(req, resp);
        }
    }

}
