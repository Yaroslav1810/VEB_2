package web.model;
import web.model.*;

public class CheckRange {
    public static boolean check(String x, String y, String r) {
        try {
            double dx = Double.parseDouble(ParseNum.parse(x));
            double dy = Double.parseDouble(ParseNum.parse(y));
            int dr = Integer.parseInt(ParseNum.parse(r));

            if (!(dx >= -5 && dx <= 3)) {
                return false;
            } else if (!(dy >= -3 && dy <= 5)) {
                return false;
            } else return dr >= 1 && dr <= 5;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
